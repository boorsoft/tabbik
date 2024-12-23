#!/bin/sh

function run_migrations() {
    echo "Starting database migrations..."

    # Run the migrations using the npm script
    echo "Running migrations..."
    npm run db:migrate

    # Check if the migration script succeeded
    if [ $? -eq 0 ]; then
        echo "Database migrations completed successfully."
    else
        echo "Error: Database migrations failed."
        exit 1
    fi
}

run_migrations

npm run dev