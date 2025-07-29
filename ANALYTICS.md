# Analytics Tracking - Petra App

## Što se prati:

### 1. **Učitavanje aplikacije** (`/api/track-app-load`)
- Vrijeme učitavanja
- User Agent (browser, uređaj)
- Referrer (odakle je došao korisnik)
- Lokacija (URL)
- Veličina ekrana
- Jezik

### 2. **Pokretanje aplikacije** (`/api/track-app-start`)
- Kada korisnik klikne "Spremna sam"
- Vrijeme pokretanja
- User Agent

### 3. **Instagram klikovi** (`/api/track-instagram-click`)
- Kada korisnik klikne na Instagram link
- Vrijeme klika
- User Agent
- Instagram link

## Kako vidjeti podatke:

### **U Vercel Dashboard-u:**
1. Idite na vaš Vercel projekt
2. Kliknite na "Functions" tab
3. Pogledajte logove za API rute

### **U Vercel CLI:**
```bash
vercel logs --follow
```

### **Dodavanje baze podataka:**
Za bolje praćenje, možete dodati:
- **MongoDB** - za čuvanje podataka
- **Supabase** - besplatna alternativa
- **Airtable** - za vizualizaciju

## Primjer podataka koji se prikupljaju:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
  "referrer": "https://www.instagram.com/",
  "location": "https://petraapp.vercel.app/",
  "screenSize": "390x844",
  "language": "hr"
}
```

## Dodatne opcije:

### **Google Analytics 4:**
```bash
npm install react-ga4
```

### **Vercel Analytics:**
```bash
npm install @vercel/analytics
```

### **Custom Dashboard:**
Možete kreirati admin panel za prikaz statistike. 