variable "resource_group_name" {
  type    = string
  default = "pspractice-rg"    # your RG
}

variable "location" {
  type    = string
  default = "eastus"
}

variable "base_name" {
  type    = string
  default = "pspractice"
}

variable "vm_admin_username" {
  type    = string
  default = "vmadmin"
}

variable "vm_admin_password" {
  type      = string
  sensitive = true
}

variable "sql_admin_login" {
  type = string
}

variable "sql_admin_password" {
  type      = string
  sensitive = true
}
