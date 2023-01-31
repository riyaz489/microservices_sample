#!/bin/bash
export PGPASSWORD=$DB_ADMIN_PASSWORD
psql -h $DB_HOST -U $DB_ADMIN -d $DB_ADMIN  -a -f ./init.sql
flask db upgrade
flask create_admin -n $DummyAdmin -p $DummyAdminPass
gunicorn --bind 0.0.0.0:5000 server:app --log-level DEBUG --reload
