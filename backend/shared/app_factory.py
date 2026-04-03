from fastapi import FastAPI


def app_factory(name: str):
    app = FastAPI(title=f"{name} service")
    @app.get("/health")
    async def health():
        return {"status": "healthy", "service": name}
    return app
