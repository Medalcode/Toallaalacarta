#!/bin/bash

# Script para configurar email de administrador
# Uso: bash setup-admin.sh tu-email@example.com

echo "🔐 Configurando Administrador para Toalla a la Carta"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si se proporcionó un email
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar un email${NC}"
    echo ""
    echo "Uso: bash setup-admin.sh tu-email@example.com"
    echo ""
    exit 1
fi

ADMIN_EMAIL="$1"

# Validar formato de email básico
if [[ ! "$ADMIN_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo -e "${RED}❌ Error: Email inválido${NC}"
    exit 1
fi

# Verificar si .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado. Creando desde .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
fi

echo -e "${BLUE}📧 Configurando email de administrador...${NC}"

# Verificar si ADMIN_EMAILS ya existe
if grep -q "ADMIN_EMAILS=" .env; then
    # Actualizar variable existente
    sed -i "s|ADMIN_EMAILS=.*|ADMIN_EMAILS=\"$ADMIN_EMAIL\"|" .env
    echo -e "${GREEN}✅ ADMIN_EMAILS actualizado${NC}"
else
    # Agregar nueva variable
    echo "" >> .env
    echo "# Admin Configuration" >> .env
    echo "ADMIN_EMAILS=\"$ADMIN_EMAIL\"" >> .env
    echo -e "${GREEN}✅ ADMIN_EMAILS agregado${NC}"
fi

echo ""
echo -e "${GREEN}🎉 ¡Configuración completada!${NC}"
echo ""
echo -e "${BLUE}📋 Email de administrador configurado:${NC}"
echo "   • $ADMIN_EMAIL"
echo ""
echo -e "${YELLOW}⚠️  Importante:${NC}"
echo "   1. Reinicia el servidor de desarrollo: npm run dev"
echo "   2. Regístrate con este email: $ADMIN_EMAIL"
echo "   3. Accede al panel de administración: http://localhost:4321/admin"
echo ""
echo -e "${BLUE}💡 Tip:${NC}"
echo "   Para agregar más administradores, edita .env y separa los emails con comas:"
echo "   ADMIN_EMAILS=\"admin1@example.com,admin2@example.com\""
echo ""
