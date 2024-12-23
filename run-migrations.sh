#!/bin/bash

function generate_migration_files() {
    echo "Generating migration files..."

    npm run db:generate

    if [ $? -eq 0 ]; then
        echo "Migration files generated successfully!"
    else 
        echo "Error: migration files generation failed"
        exit 1
    fi
}

function run_migrations() {
    echo "Starting database migrations..."

    # Check if ts-node is installed
    if ! command -v ts-node &> /dev/null; then
        echo "Error: ts-node is not installed. Please install it before proceeding."
        exit 1
    fi

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

generate_migration_files
run_migrations

npm run dev