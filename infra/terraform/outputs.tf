output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "vm_public_ip" {
  value = azurerm_public_ip.vm_pip.ip_address
}

output "sql_server_fqdn" {
  value = azurerm_mssql_server.sql.fully_qualified_domain_name
}

output "sql_connection_string" {
  value       = "Server=tcp:${azurerm_mssql_server.sql.fully_qualified_domain_name},1433;Initial Catalog=${azurerm_mssql_database.db.name};User ID=${var.sql_admin_login};Password=${var.sql_admin_password};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  sensitive   = true
}

output "aks_name" {
  value = azurerm_kubernetes_cluster.aks.name
}
