# Build and run on free-tier hosts (Render, Fly.io, Railway, etc.).
# Render has no native .NET runtime — use Docker Web Service.

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ElPortero.Api.csproj .
RUN dotnet restore ElPortero.Api.csproj
COPY . .
RUN dotnet publish ElPortero.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
ENTRYPOINT ["dotnet", "ElPortero.Api.dll"]
