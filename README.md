# 🎮 Balanced Scale Game - Frontend

Next.js multiplayer game frontend with Socket.io integration.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## 🐳 Docker Deployment

### Build and Run
```bash
docker build -t balanced-scale-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com balanced-scale-frontend
```

## 📋 Environment Variables

Create `.env.local` for development:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

Production (set in Dokploy):
```env
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
NODE_ENV=production
```

## 🔧 Dokploy Deployment

### Prerequisites
- Server repo deployed first at `api.yourdomain.com`
- GitHub repository created

### Steps

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Create App in Dokploy:**
   - Go to Dokploy Dashboard
   - Click "Create App" → "Docker"
   - Configure:
     - **Name**: `balanced-scale-frontend`
     - **Repository**: Your GitHub repo URL
     - **Branch**: `main`
     - **Dockerfile**: `Dockerfile`
     - **Port**: `3000`
     - **Domain**: `yourdomain.com`

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
   NODE_ENV=production
   ```

4. **Enable Auto-Deploy:**
   - Go to Settings → CI/CD
   - Enable "Auto Deploy on Push"
   - Select branch: `main`

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Traefik auto-configures SSL ✨

## 🔄 Auto-Deploy Workflow

```
Push to GitHub → Dokploy pulls → Builds Docker → 
Traefik handles SSL → App deploys
```

Every commit to `main` automatically deploys!

## 🌐 Production URLs

- **Frontend**: https://yourdomain.com
- **Backend API**: https://api.yourdomain.com

## 🏗️ Project Structure

```
app/
├── page.tsx                  # Home page
├── layout.tsx               # Root layout
├── globals.css              # Global styles
├── multiplayer/             # Multiplayer game
│   ├── page.tsx
│   ├── components/          # Game components
│   └── views/               # Game views
├── hooks/                   # Custom hooks
├── types/                   # TypeScript types
└── util/                    # Utilities
```

## 🔐 Production Checklist

- [ ] Update `NEXT_PUBLIC_SOCKET_URL` to production backend
- [ ] Enable auto-deploy on push
- [ ] Configure domain in Dokploy
- [ ] Enable SSL/HTTPS
- [ ] Test WebSocket connection
- [ ] Verify game functionality

## 🐛 Troubleshooting

### Can't connect to backend
- Verify `NEXT_PUBLIC_SOCKET_URL` is correct
- Check if backend is deployed and running
- Ensure backend allows CORS from your domain

### Build fails
- Check Node.js version (requires >=20)
- Verify all dependencies in package.json
- Check Dokploy build logs

### SSL/HTTPS issues
- Ensure domain DNS points to Dokploy server
- Wait a few minutes for certificate generation
- Check Traefik logs in Dokploy

## 📚 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io Client
- **Deployment**: Docker + Dokploy + Traefik

## 🔗 Related Repository

- **Server**: https://github.com/yourusername/balanced-scale-server

---

See [DEPLOYMENT-SEPARATE-REPOS.md](DEPLOYMENT-SEPARATE-REPOS.md) for complete deployment guide.
