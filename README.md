# 🚀 CampusHub  
### Multi-Tenant Campus Management Backend (Django REST Framework)

CampusHub is a production-ready, multi-tenant backend system built using Django REST Framework.  
It enables multiple educational institutes to operate on a shared platform while maintaining strict data isolation, role-based access control, and secure JWT authentication.

This project demonstrates real-world backend engineering practices including:

- Multi-tenancy enforcement  
- Role-based authorization (RBAC)  
- Secure serializer design  
- RESTful architecture using ViewSets & Routers  
- Object-level permission control  
- Modular and scalable code structure  

---

# 🏗 System Overview

CampusHub allows students, faculty, and staff of an institute to:

- Register and authenticate securely  
- Raise and manage campus issues  
- Receive notifications  
- Operate strictly within their institute's data scope  

Each institute acts as an isolated tenant in the system.

---

# 🔐 Core Architecture Principles

## Multi-Tenancy (Tenant Isolation)

- Every user belongs to exactly one institute  
- Every issue belongs to exactly one institute  
- All queries are filtered by the authenticated user's institute  
- Cross-institute access is structurally impossible  

Tenant enforcement is implemented at:
- Queryset level  
- Serializer level  
- Permission level  

---

## Role-Based Access Control (RBAC)

Roles:
- STUDENT  
- FACULTY  
- STAFF  

Permissions:

| Action | Student | Faculty | Staff |
|--------|----------|----------|--------|
| Create issue | ✅ | ✅ | ✅ |
| View own issues | ✅ | ✅ | ✅ |
| View all institute issues | ❌ | ✅ | ✅ |
| Update status/priority | ❌ | ✅ | ✅ |
| Modify other users' issues | ❌ | ❌ | ❌ |

Custom DRF permission classes enforce role and ownership rules.

---

# 🔒 Secure API Design

Security is enforced server-side:

- JWT authentication (access + refresh tokens)  
- Refresh token blacklisting for logout  
- No client-controlled ownership fields  
- Institute and user injected from request context  
- Object-level permission checks before modifications  

---

# 📦 Features

## Authentication
- Register with institute code  
- Login using JWT  
- Refresh tokens  
- Logout with blacklist support  
- `/auth/me/` endpoint  

## Institute System
- Unique institute codes  
- Tenant-scoped users  
- Institute-level isolation  

## Issue Management
- Create campus issues  
- Categorize issues  
- Status lifecycle:
  - OPEN  
  - IN_PROGRESS  
  - RESOLVED  
- Priority levels:
  - LOW  
  - MEDIUM  
  - HIGH  
- Ownership-based restrictions  
- Institute-wide visibility for faculty/staff  

## Notifications
- Triggered on issue updates  
- Institute-scoped delivery  
- Role-aware messaging  

---

# 🧱 Project Structure

accounts/
    models.py
    serializers.py
    views.py
    urls.py

issues/
    models.py
    serializers.py
    permissions.py
    views.py
    urls.py

notifications/
    models.py
    utils.py

Architecture layers:

- Models → Data schema & tenant boundary  
- Serializers → Validation & security enforcement  
- ViewSets → Business orchestration  
- Permissions → Role & ownership enforcement  
- Routers → RESTful endpoint mapping  

---

# 🌐 API Endpoints

Authentication:

POST   /auth/register/  
POST   /auth/login/  
POST   /auth/refresh/  
POST   /auth/logout/  
GET    /auth/me/  
GET    /institutes/  

Issues:

GET     /issues/  
POST    /issues/  
GET     /issues/{id}/  
PATCH   /issues/{id}/  
DELETE  /issues/{id}/  
PATCH   /issues/{id}/admin_update/  

---

# 🛠 Tech Stack

Backend:
- Django  
- Django REST Framework  
- Simple JWT  

Database:
- PostgreSQL / SQLite  

Architecture:
- Multi-tenant design  
- RESTful APIs  
- ViewSets + Routers  
- Custom DRF permissions  

---

# 🧠 Design Decisions

- Used Profile model to extend Django's built-in User model cleanly  
- Used ViewSets + Routers for REST consistency  
- Implemented custom permission classes for role-based security  
- Injected institute and user from request to prevent tenant spoofing  
- Enforced object-level permissions for ownership safety  

---

# 🧪 Security Considerations

- No cross-tenant data leakage  
- All write operations pass through object-level permission checks  
- Sensitive fields never accepted from client input  
- Role validation enforced before modification  
- JWT token invalidation via blacklist  

---

# 📈 Scalability Considerations

The system is designed to scale by:

- Filtering data at queryset level  
- Keeping logic modular per app  
- Separating permission logic  
- Avoiding hardcoded tenant assumptions  
- Using clean REST abstractions  

Future extensions may include:
- Marketplace module  
- Order management  
- Audit logging  
- Activity tracking  
- Real-time notifications  

---

# 🚀 Getting Started

git clone <repository-url>  
cd campus-hub  
python -m venv venv  
source venv/bin/activate   # or venv\Scripts\activate on Windows  
pip install -r requirements.txt  
python manage.py migrate  
python manage.py runserver  

---

# 📌 Learning Outcomes

This project demonstrates:

- Multi-tenant system design  
- Production-grade DRF architecture  
- Secure permission handling  
- Clean modular backend structure  
- Real-world SaaS backend patterns  

---

# 👨‍💻 Author

Built as a scalable campus SaaS backend system demonstrating secure and modular API design.
