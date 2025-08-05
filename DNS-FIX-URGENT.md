# 🚨 DNS FIX REQUIRED - theporadas.com

## Current Issue Detected

Your domain `www.theporadas.com` is resolving to **wrong IP addresses**:

```
Current Resolution:
www.theporadas.com → 216.198.79.1, 64.29.17.1
```

**This means:** Your domain is still pointing to your **old hosting provider**, not Vercel.

---

## 🔧 **IMMEDIATE FIX REQUIRED**

### **Step 1: Log into Porkbun DNS Management**

1. Go to [porkbun.com](https://porkbun.com)
2. Sign in → Account → Domain Management
3. Find `theporadas.com` → Click "Details" → Click "DNS" tab

### **Step 2: Remove Old DNS Records**

**❌ DELETE these records if they exist:**

- Any A record for `www` host
- Any A record pointing to `216.198.79.1` or `64.29.17.1`
- Any CNAME for `www` pointing to old hosting providers
- Any parking page redirects

### **Step 3: Add Correct Vercel DNS Records**

#### **Record 1: WWW CNAME (CRITICAL)**

```
Type: CNAME
Host: www
Answer: cname.vercel-dns.com
TTL: 300 (low for faster propagation)
```

#### **Record 2: Root Domain A Record**

```
Type: A
Host: @ (or blank)
Answer: 76.76.19.19
TTL: 300
```

### **Step 4: Save and Wait**

1. **Save changes** in Porkbun
2. **Wait 15-30 minutes** for propagation
3. **Test with:** `nslookup www.theporadas.com`

---

## ✅ **Expected Results After Fix**

### **Correct DNS Resolution:**

```powershell
# What you should see:
nslookup www.theporadas.com
# Result:
www.theporadas.com canonical name = cname.vercel-dns.com
cname.vercel-dns.com has address = [Vercel IP]
```

### **Working Website:**

- `https://www.theporadas.com` → Your wedding website
- `https://theporadas.com` → Redirects to www version
- Green padlock (HTTPS) working

---

## 🚨 **Why This Happened**

**Possible causes:**

1. **DNS records not updated** - Still pointing to old hosting
2. **Wrong CNAME value** - Should be `cname.vercel-dns.com`
3. **Conflicting A records** - Old A records overriding CNAME
4. **Propagation delay** - Can take up to 48 hours (rare)

---

## 🔍 **Verify the Fix**

### **Test Commands:**

```powershell
# Clear local DNS cache first
ipconfig /flushdns

# Test WWW subdomain
nslookup www.theporadas.com

# Test root domain
nslookup theporadas.com

# Test website loading
curl -I https://www.theporadas.com
```

### **Online DNS Checkers:**

- [dnschecker.org](https://dnschecker.org) - Enter `www.theporadas.com`
- [whatsmydns.net](https://whatsmydns.net) - Check global propagation

---

## 📞 **Need Help?**

If DNS doesn't fix after 2 hours:

### **Porkbun Support:**

- Email: support@porkbun.com
- Include: "DNS CNAME not working for theporadas.com"

### **Vercel Support:**

- Dashboard → Help → Contact Support
- Include: "Custom domain not resolving correctly"

---

## 🎯 **Action Required NOW**

1. **🔴 URGENT:** Fix DNS records in Porkbun (5 minutes)
2. **🟡 WAIT:** DNS propagation (15-60 minutes)
3. **🟢 TEST:** Verify website loads correctly

**Priority:** Fix DNS immediately - your wedding website won't be accessible until this is resolved!

---

_DNS Fix Guide - August 5, 2025_
