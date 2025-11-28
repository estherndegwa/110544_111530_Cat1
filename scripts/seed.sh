#!/usr/bin/env bash
set -euo pipefail

# Seed the MongoDB using the init script. If the container is already running,
# we can also run the script directly via mongosh.
echo "Seeding MongoDB..."
docker exec -i mongo mongosh -u root -p rootpassword --authenticationDatabase admin < seed/seed.mongo.js
echo "Seed completed."