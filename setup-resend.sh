#!/bin/bash

# Script para configurar variables de entorno de Resend
# Uso: bash setup-resend.sh

echo "🚀 Configurando Resend para Toalla a la Carta"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado. Creando desde .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
else
    echo -e "${BLUE}ℹ️  Archivo .env ya existe${NC}"
fi

# API Key proporcionada
RESEND_API_KEY="re_B9ZMcwwv_KERC9pDBCSX3vCXkS87coR6G"

echo ""
echo -e "${BLUE}📧 Configurando variables de Resend...${NC}"

# Verificar si las variables ya existen
if grep -q "RESEND_API_KEY=" .env; then
    # Actualizar variable existente
    sed -i "s|RESEND_API_KEY=.*|RESEND_API_KEY=\"$RESEND_API_KEY\"|" .env
    echo -e "${GREEN}✅ RESEND_API_KEY actualizada${NC}"
else
    # Agregar nueva variable
    echo "" >> .env
    echo "# Resend Email Configuration" >> .env
    echo "RESEND_API_KEY=\"$RESEND_API_KEY\"" >> .env
    echo -e "${GREEN}✅ RESEND_API_KEY agregada${NC}"
fi

# Configurar EMAIL_FROM si no existe
if ! grep -q "EMAIL_FROM=" .env; then
    echo "EMAIL_FROM=\"Toalla a la Carta <onboarding@resend.dev>\"" >> .env
    echo -e "${GREEN}✅ EMAIL_FROM agregado${NC}"
fi

# Configurar EMAIL_REPLY_TO si no existe
if ! grep -q "EMAIL_REPLY_TO=" .env; then
    echo "EMAIL_REPLY_TO=\"contacto@toallaalacarta.cl\"" >> .env
    echo -e "${GREEN}✅ EMAIL_REPLY_TO agregado${NC}"
fi

# Configurar PUBLIC_SITE_URL si no existe
if ! grep -q "PUBLIC_SITE_URL=" .env; then
    echo "PUBLIC_SITE_URL=\"http://localhost:4321\"" >> .env
    echo -e "${GREEN}✅ PUBLIC_SITE_URL agregado${NC}"
fi

echo ""
echo -e "${GREEN}🎉 ¡Configuración completada!${NC}"
echo ""
echo -e "${BLUE}📋 Variables configuradas:${NC}"
echo "   • RESEND_API_KEY: re_B9ZMcwwv_KERC9pDBCSX3vCXkS87coR6G"
echo "   • EMAIL_FROM: Toalla a la Carta <onboarding@resend.dev>"
echo "   • EMAIL_REPLY_TO: contacto@toallaalacarta.cl"
echo "   • PUBLIC_SITE_URL: http://localhost:4321"
echo ""
echo -e "${YELLOW}⚠️  Importante:${NC}"
echo "   1. Reinicia el servidor de desarrollo: npm run dev"
echo "   2. Prueba el email de bienvenida registrando un nuevo usuario"
echo "   3. Prueba el email de confirmación completando un checkout"
echo ""
echo -e "${BLUE}🔗 Recursos:${NC}"
echo "   • Dashboard de Resend: https://resend.com/emails"
echo "   • Documentación: Ver RESEND_SETUP.md"
echo ""
