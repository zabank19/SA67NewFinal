package genders


import (

   "net/http"
   "github.com/gtwndtl/projectsa/config"
   "github.com/gtwndtl/projectsa/entity"
   "github.com/gin-gonic/gin"

)


func GetAll(c *gin.Context) {
   db := config.DB()

   var genders []entity.Genders
   db.Find(&genders)

   c.JSON(http.StatusOK, &genders)
}