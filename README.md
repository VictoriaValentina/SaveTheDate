# Convite de Casamento - Wedding Invitation

Um site moderno e elegante para convite de casamento com animações suaves, integração com Supabase e confirmação de presença.

## 🎉 Funcionalidades

- ✨ **Envelope Interativo**: Clique no selo (coração) para abrir o convite
- 💌 **Design Responsivo**: Adapta-se a qualquer tamanho de tela
- 🎨 **Animações Suaves**: Transições elegantes com Framer Motion
- 📝 **Formulário RSVP**: Confirmação de presença com validação
- 🔧 **Integração Supabase**: Salva respostas em banco de dados
- 📱 **Mobile First**: Otimizado para dispositivos móveis

## 🛠️ Tecnologias

- **React** - Framework UI
- **Vite** - Build tool rápido
- **Tailwind CSS** - Styling utilitário
- **Framer Motion** - Animações
- **Supabase** - Backend e banco de dados

## 📋 Campos do Formulário

- `name` - Nome completo
- `email` - E-mail para contato
- `confirmed_church` - Confirmação na cerimônia religiosa
- `confirmed_barbecue` - Confirmação na churrascaria
- `companions` - Número de acompanhantes
- `companions_names` - Nomes dos acompanhantes

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

Crie um arquivo `.env.local` na raiz do projeto:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-chave-anonima
```

### 3. Criar tabela no Supabase

```sql
CREATE TABLE wedding_rsvps (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  confirmed_church BOOLEAN DEFAULT FALSE,
  confirmed_barbecue BOOLEAN DEFAULT FALSE,
  companions INT DEFAULT 0,
  companions_names TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Permitir inserção pública
ALTER TABLE wedding_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON wedding_rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON wedding_rsvps
  FOR SELECT USING (true);
```

### 4. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

## 🚀 Deployment

### Build para produção

```bash
npm run build
```

### Deploy no Vercel, Netlify ou similar

```bash
npm run build
# Enviar a pasta 'dist' para seu hosting
```

## 📸 Screenshots

- Envelope fechado com selo interativo
- Convite aberto com detalhes do casamento
- Formulário RSVP com confirmação

## 🎯 Customizações

### Cores

Edite `tailwind.config.js` para alterar o esquema de cores:

```javascript
colors: {
  rose: { ... },
  amber: { ... }
}
```

### Textos

Modifique os textos nos componentes:

- `src/components/InvitationCard.jsx` - Detalhes do convite
- `src/components/Envelope.jsx` - Mensagem do envelope
- `src/components/RSVPForm.jsx` - Rótulos do formulário

### Fonts

Customize no `tailwind.config.js`:

```javascript
fontFamily: {
  playfair: ['Playfair Display', 'serif'],
  lato: ['Lato', 'sans-serif']
}
```

## 🐛 Troubleshooting

**Erro: "Cannot find module '@supabase/supabase-js'"**

```bash
npm install @supabase/supabase-js
```

**Variáveis de ambiente não funcionam**

- Certifique-se de usar `VITE_` como prefixo
- Renomeie `.env.local` para `.env.local` (sem typos)
- Reinicie o servidor de desenvolvimento

**Formulário não envia dados**

- Verifique as credenciais do Supabase em `.env.local`
- Confirme que a tabela foi criada corretamente
- Abra o console (F12) para ver mensagens de erro

## 📞 Suporte

Para dúvidas sobre Supabase, visite: https://supabase.com/docs

## 💝 Personalizações Recomendadas

- [ ] Adicionar fotos dos noivos
- [ ] Incluir data e hora do evento
- [ ] Adicionar QR code com endereço do local
- [ ] Incluir lista de presentes/honeymoon
- [ ] Adicionar música de fundo
- [ ] Criar página de galeria
- [ ] Adicionar seção de histórias/depoimentos

---

Desenvolvido com ❤️ para um momento especial!
