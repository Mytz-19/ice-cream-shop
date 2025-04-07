import uvicorn

if __name__ == "__main__":
    # uvicorn.run("fastapi_app:app", host="127.0.0.1", port=8080, reload=True)
    uvicorn.run("fastapi_app:app", host="0.0.0.0", port=8080, reload=True)