# GitLite

A Git-inspired version control system built from scratch — featuring content-addressable blob storage, parent-linked commit history, and branch pointer management. Exposed via a REST API with a React frontend.

> Built as a portfolio project to deeply understand how Git works under the hood.

---

## Tech Stack

**Backend**
- Java 25, Spring Boot 4.0.5
- MySQL 8.0.45
- Maven

**Frontend**
- React (Create React App)
- Runs on `localhost:3000`, talks to backend on `localhost:8080`

---

## Features

- **Repositories** — create and manage named repositories
- **Branches** — create branches scoped to a repository, each pointing to a head commit
- **Commits** — atomic commit operation: stores file content as a blob, creates a commit with parent linkage, and advances the branch pointer
- **Commit History** — walk the `parentHash` chain to reconstruct linear commit history
- **Content-Addressable Storage** — file content is hashed (SHA-1) and deduplicated via a `blobs` table
- **REST API** — full CRUD for all entities plus a high-level `/git/simulate-commit` endpoint

---

## Project Structure

```
gitlite/
├── src/
│   └── main/java/com/gitlite/gitlite/
│       ├── entity/          # Blob, Commit, Branch, Repository
│       ├── repository/      # JPA repositories
│       ├── service/         # BlobService, CommitService, BranchService, RepositoryService, GitService
│       ├── controller/      # REST controllers
│       ├── dto/             # CommitRequest, BranchRequest, SimulateCommitResponse
│       └── exception/       # GlobalExceptionHandler, ResourceNotFoundException
├── gitlite-frontend/        # React frontend
│   └── src/
│       ├── App.js
│       └── components/      # ReposView, RepoDetailView, CommitView
└── pom.xml
```

---

## API Reference

### Repositories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/repositories` | Create a repository |
| `GET` | `/repositories` | List all repositories |

### Branches
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/branches` | Create a branch |
| `GET` | `/branches?repositoryId=` | List branches (optional filter by repo) |
| `GET` | `/branches/{name}` | Get branch by name |
| `PUT` | `/branches/{name}` | Update branch head |

### Commits
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/commits` | Create a commit |
| `GET` | `/commits/{startHash}` | Get commit history from a given hash |

### Blobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/blobs` | Store a blob (multipart file) |
| `GET` | `/blobs/{hash}` | Retrieve blob by hash |

### Git (High-Level)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/git/simulate-commit` | Atomically store blob + create commit + update branch |

---

## Running Locally

### Prerequisites
- Java 25
- MySQL 8.0.45
- Node.js + npm

### Backend

1. Create a MySQL database:
```sql
CREATE DATABASE gitlite;
```

2. Configure `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gitlite
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

3. Run the Spring Boot app:
```bash
./mvnw spring-boot:run
```

### Frontend

```bash
cd gitlite-frontend
npm install
npm start
```

Frontend will be available at `http://localhost:3000`.

---

## How It Works

### Content-Addressable Storage
Every file committed is SHA-1 hashed. The hash is the blob's identity — identical files are stored once and referenced by hash, exactly like Git objects.

### Commit Chain
Each commit stores a `parentHash` pointing to the previous commit, forming a singly-linked list. Commit history is reconstructed by walking this chain from the branch's `headCommitHash` back to the root (where `parentHash` is null).

### Branch Pointers
A branch is just a name + a pointer to the latest commit hash. On every commit, the branch's `headCommitHash` is updated atomically with the new commit.

---

## Known Limitations

- Commit history is a **linear chain**, not a true DAG. No merge commits with multiple parents.
- No diff computation, merge, or conflict resolution.
- Repo rename is not yet persisted to the database (`PUT /repositories/{id}` not implemented).

---

## Deployment

- Backend: [Railway](https://railway.app) (Spring Boot + MySQL)
- Frontend: [Vercel](https://vercel.com) (React)

---

## License

MIT
