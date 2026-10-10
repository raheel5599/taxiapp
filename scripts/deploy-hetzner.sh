#!/usr/bin/env bash
set -euo pipefail
APP_DIR=/home/fpadmin/sites/tariq-taxi-app
mkdir -p "$APP_DIR"
tar -xzf /tmp/tariq-taxi-app.tar.gz -C "$APP_DIR"
docker network inspect fahrschulpilot_web >/dev/null 2>&1 || docker network create fahrschulpilot_web
cd "$APP_DIR"
# Preserve the existing Compose project/service so the named app container can
# be updated without colliding with it or removing sibling API containers.
APP_PROJECT=tariq-taxi-app
APP_SERVICE=app
if docker inspect tariq-taxi-app >/dev/null 2>&1; then
  APP_PROJECT=$(docker inspect tariq-taxi-app --format '{{index .Config.Labels "com.docker.compose.project"}}')
  APP_SERVICE=$(docker inspect tariq-taxi-app --format '{{index .Config.Labels "com.docker.compose.service"}}')
  [[ "$APP_PROJECT" =~ ^[a-z0-9][a-z0-9_-]*$ && "$APP_SERVICE" =~ ^[a-zA-Z0-9][a-zA-Z0-9_.-]*$ ]] || {
    echo 'App-Container hat keine gültige Compose-Zuordnung. Deployment abgebrochen.'; exit 1;
  }
fi
APP_COMPOSE=$(mktemp /tmp/taxi-compose.XXXXXX.json)
trap 'rm -f "$APP_COMPOSE"' EXIT
docker compose -f compose.production.yml config --format json | python3 -c '
import json,sys
config=json.load(sys.stdin)
config["name"]=sys.argv[1]
config["services"]={sys.argv[2]:config["services"]["app"]}
json.dump(config,sys.stdout)
' "$APP_PROJECT" "$APP_SERVICE" > "$APP_COMPOSE"
docker compose -p "$APP_PROJECT" -f "$APP_COMPOSE" up -d --build "$APP_SERVICE"
APP_IP=$(docker inspect tariq-taxi-app --format '{{(index .NetworkSettings.Networks "fahrschulpilot_web").IPAddress}}')
for attempt in $(seq 1 15); do
  if curl --fail --silent --show-error "http://$APP_IP/" -o /tmp/taxi-health.html; then break; fi
  if [ "$attempt" = 15 ]; then docker logs --tail 30 tariq-taxi-app; exit 1; fi
  sleep 2
done
grep -q 'id="root"' /tmp/taxi-health.html
CADDY_CONTAINER=$(docker ps --filter name=^/fahrschulpilot-caddy-1$ --format '{{.Names}}' | head -n 1)
[ -n "$CADDY_CONTAINER" ] || { echo 'Kein aktiver Caddy-Container gefunden.'; exit 1; }
# Use the actual mounted config, never guess a server path.
CADDY_CONFIG=$(docker inspect "$CADDY_CONTAINER" --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}')
[ -f "$CADDY_CONFIG" ] || { echo 'Caddyfile-Mount nicht gefunden. Serverkonfiguration muss geprüft werden.'; exit 1; }
# Shared routing belongs to fahrschulpilot. App deployment is read-only here.
python3 - "$CADDY_CONFIG" <<'ROUTES'
import re, sys
from pathlib import Path
text = Path(sys.argv[1]).read_text()
block = re.search(r'(?ms)^[^\n{]*\bapp\.tariq-taxizentrale\.de\s*\{(.*?)^\}', text)
if not block or not re.search(r'(?m)^\s*reverse_proxy\s+tariq-taxi-app:80\s*$', block.group(1)):
    raise SystemExit('Geschützte Taxi-Route fehlt. Zentrales Routing-Deployment erforderlich.')
ROUTES
for attempt in $(seq 1 15); do
  if curl --fail --silent --show-error --max-time 15 https://app.tariq-taxizentrale.de/ -o /tmp/taxi-public.html && grep -q 'id="root"' /tmp/taxi-public.html; then
    echo 'Taxi-App öffentlich erreichbar.'
    exit 0
  fi
  sleep 2
done
echo 'App intern erreichbar; öffentlicher TLS-/Proxy-Check noch fehlgeschlagen.'
exit 1
