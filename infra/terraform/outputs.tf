output "vm_public_ip" {
  value = azurerm_public_ip.vm_pip.ip_address
}

output "sql_server_fqdn" {
  value = azurerm_mssql_server.sql.fully_qualified_domain_name
}

output "sql_connection_string" {
  value     = "Server=tcp:${azurerm_mssql_server.sql.fully_qualified_domain_name},1433;Initial Catalog=${azurerm_mssql_database.db.name};User ID=${var.sql_admin};Password=${var.sql_password};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  sensitive = true
}
