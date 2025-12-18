#!/bin/bash

# YumYum Sprint 0 Setup Script
# Este script completa la configuración inicial del proyecto

echo "🍽️  YumYum - Sprint 0 Setup"
echo "================================"

# Colores para output
GREEN='\033[0[32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Instalando dependencias...${NC}"
pnpm install

echo -e "${BLUE}🐳 Iniciando servicios de Docker...${NC}"
docker-compose up -d

echo -e "${BLUE}⏳ Esperando que PostgreSQL esté listo...${NC}"
sleep 5

echo -e "${BLUE}🗄️  Configurando base de datos...${NC}"
cd apps/api
cp .env.example .env
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/yumyum" >> .env
echo "REDIS_URL=redis://localhost:6379" >> .env
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env
echo "JWT_REFRESH_SECRET=$(openssl rand -hex 32)" >> .env

echo -e "${GREEN}✅ Setup completado!${NC}"
echo ""
echo "Para iniciar el proyecto en modo desarrollo:"
echo "  pnpm dev"
echo ""
echo "Las aplicaciones estarán disponibles en:"
echo "  - Admin:     http://localhost:3000"
echo "  - Booking:   http://localhost:3001"
echo "  - Dashboard: http://localhost:3002"
echo "  - API:       http://localhost:4000"
echo ""
