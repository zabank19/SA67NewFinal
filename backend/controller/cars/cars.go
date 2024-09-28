package cars

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/gtwndtl/projectsa/config"
    "github.com/gtwndtl/projectsa/entity"
)

func GetAll(c *gin.Context) {
    var cars []entity.Cars

    db := config.DB()
    results := db.Find(&cars)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusCreated, cars)
}

func Get(c *gin.Context) {
    ID := c.Param("id")
    var cars entity.Cars

    db := config.DB()
    results := db.First(&cars, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    if cars.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }

    c.JSON(http.StatusOK, cars)
}

func Update(c *gin.Context) {
    var cars entity.Cars
    CarID := c.Param("id")

    db := config.DB()
    result := db.First(&cars, CarID)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "ID not found"})
        return
    }

    if err := c.ShouldBindJSON(&cars); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"status": 400,"message": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&cars)

    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"status": 400, "message": "Bad request"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": 200, "message": "Updated successful"})
}

func Delete(c *gin.Context) {
    CarID := c.Param("id")

    db := config.DB()
    // Perform the delete operation directly without using soft delete
    if err := db.Delete(&entity.Cars{}, CarID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"status": 400, "error": "id not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": 200, "message": "Deleted successful"})
}


