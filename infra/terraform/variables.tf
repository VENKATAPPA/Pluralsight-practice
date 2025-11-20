variable "prefix"      { default = "pspractice" }
variable "location"    { default = "eastus" }
variable "sql_admin"   {}
variable "sql_password" {
  sensitive = true
}
