# Multi-stage build for ASP.NET Core API

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["src/api/SocialMediaApp.Api.csproj", "api/"]
RUN dotnet restore "api/SocialMediaApp.Api.csproj"

COPY src/api/ api/
WORKDIR "/src/api"
RUN dotnet build "SocialMediaApp.Api.csproj" -c Release -o /app/build

RUN dotnet publish "SocialMediaApp.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SocialMediaApp.Api.dll"]
