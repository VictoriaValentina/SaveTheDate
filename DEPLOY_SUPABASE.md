## 🔒 Deploy Seguro - Variáveis de Ambiente Supabase

### ❌ NUNCA faça isso:
```javascript
// NÃO coloque as credenciais direto no código!
const SUPABASE_URL = "https://seu-url.supabase.co";
const SUPABASE_KEY = "sua-chave-aqui";
```

### ✅ FORMA CORRETA - Variáveis de Ambiente

## 1️⃣ **Vercel** (Recomendado para React/Vite)

### Local (desenvolvimento):
Crie arquivo `.env.local` na raiz:
```env
VITE_SUPABASE_URL=https://sua-url.supabase.co
VITE_SUPABASE_KEY=sua-chave-publica-aqui
```

### Deploy no Vercel:
```bash
npm install -g vercel
vercel
```

Ou via Dashboard:
1. Vá para [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Vá para **Settings** → **Environment Variables**
4. Adicione:
   - `VITE_SUPABASE_URL` = sua URL
   - `VITE_SUPABASE_KEY` = sua chave pública
5. Deploy automático ao fazer push

---

## 2️⃣ **Netlify**

### Via Dashboard:
1. Vá para [netlify.com](https://netlify.com)
2. Conecte seu repositório
3. Vá para **Site settings** → **Build & deploy** → **Environment**
4. Clique em **Edit variables**
5. Adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
6. Deploy automático

### Ou via arquivo `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_SUPABASE_URL = "https://sua-url.supabase.co"
  VITE_SUPABASE_KEY = "sua-chave-publica"
```

---

## 3️⃣ **AWS Amplify**

1. Vá para AWS Amplify Console
2. Conecte seu repositório
3. **Environment variables**
4. Adicione as credenciais
5. Deploy

---

## 4️⃣ **GitHub Pages + Actions**

Crie `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Depois adicione as secrets no GitHub:
1. Vá para **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

---

## 5️⃣ **Servidor Linux (VPS/DigitalOcean)**

### Opção A - Build local e upload:
```bash
# Localmente:
npm run build

# Upload para servidor:
scp -r dist/ seu-usuario@seu-servidor:/var/www/seu-site/

# SSH no servidor:
ssh seu-usuario@seu-servidor

# Instalar nginx se não tiver
sudo apt install nginx

# Configurar nginx
sudo nano /etc/nginx/sites-available/default
```

Nginx config:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        root /var/www/seu-site;
        try_files $uri /index.html;
    }
}
```

### Opção B - Variáveis em arquivo .env (Docker):
```dockerfile
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build:
```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://sua-url.supabase.co \
  --build-arg VITE_SUPABASE_KEY=sua-chave \
  -t meu-site .

docker run -p 80:80 meu-site
```

---

## 6️⃣ **Cloudflare Pages**

1. Vá para [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Pages** → **Connect to Git**
3. Selecione seu repositório
4. **Build settings:**
   - Framework: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
5. **Environment variables** → Adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
6. Deploy

---

## 🔐 Segurança - Pontos Importantes

### ✅ Sempre use variáveis de ambiente:
- Nunca commit `.env.local` no Git
- Adicionar `.env.local` ao `.gitignore`

### ✅ Use a chave PÚBLICA do Supabase:
- A chave é pública (está no navegador)
- Use Row Level Security (RLS) no Supabase para controlar acesso
- Nunca exponha a chave de serviço (service_role_key)

### ✅ Configure RLS no Supabase:
No Supabase Dashboard:
1. Vá para a tabela `wedding_rsvps`
2. Clique em **Authentication** → **Policies**
3. Crie uma política que permite apenas INSERT:

```sql
CREATE POLICY "Anyone can insert RSVP"
ON wedding_rsvps FOR INSERT
WITH CHECK (true);
```

---

## 📋 Passo a Passo Rápido (Vercel)

```bash
# 1. Instale Vercel CLI
npm install -g vercel

# 2. Faça login
vercel login

# 3. Primeiro deploy
vercel

# 4. Adicione variáveis
vercel env add VITE_SUPABASE_URL
# Cola a URL e Enter

vercel env add VITE_SUPABASE_KEY
# Cola a chave e Enter

# 5. Deploy com variáveis
vercel
```

---

## 🔍 Verificação

Após deploy, abra o site e verifique:
- Abra DevTools (F12)
- Vá para **Console**
- Se não houver erros de credenciais, está OK!
- Os dados devem aparecer no Supabase quando alguém submeter o formulário

---

## 🚀 Resumo Recomendado

| Plataforma | Dificuldade | Custo | Recomendação |
|-----------|-----------|-------|-------------|
| **Vercel** | ⭐ Fácil | Grátis | ✅ MELHOR |
| **Netlify** | ⭐ Fácil | Grátis | ✅ Bom |
| **Cloudflare Pages** | ⭐ Fácil | Grátis | ✅ Bom |
| **DigitalOcean** | ⭐⭐ Médio | $5-6/mês | OK |
| **AWS** | ⭐⭐⭐ Difícil | Variável | Complexo |

**Recomendação: Use Vercel - Deploy em 2 minutos! 🚀**
