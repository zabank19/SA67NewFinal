package problems

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gtwndtl/projectsa/config"
	"github.com/gtwndtl/projectsa/entity"
	"github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
	var problems []entity.Problem

	db := config.DB()
	results := db.Model(&entity.Problem{}).Preload("Users").Find(&problems)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, problems)
}

func Post(c *gin.Context) {
	var problem entity.Problem

	db := config.DB()

	if err := c.ShouldBindJSON(&problem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	s := c.Params.ByName("id")
	problem.UserID, _ = strconv.ParseInt(s, 10, 64)
	problem.DT = time.Now()

	result := db.Save(&problem)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Get(c *gin.Context) {

	ID := c.Param("id")
	var problem entity.Problem

	db := config.DB()
	results := db.First(&problem, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if problem.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, problem)

}

func Update(c *gin.Context) {

	var problem entity.Problem

	UserID := c.Param("id")

	db := config.DB()
	result := db.First(&problem, UserID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&problem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&problem)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Delete(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM users WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
