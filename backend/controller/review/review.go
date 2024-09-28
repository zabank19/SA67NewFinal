package review

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gtwndtl/projectsa/config"
	"github.com/gtwndtl/projectsa/entity"
)

// GetAll - ดึงรีวิวทั้งหมด
func GetAll(c *gin.Context) {
	var review []entity.Review

	db := config.DB()
	results := db.Model(&entity.Review{}).Preload("User").Find(&review)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, review)
}

// CreateReview - สร้างรีวิวใหม่
// CreateReview - สร้างรีวิวใหม่ (ตรวจสอบว่ามีข้อมูล review อยู่แล้วหรือไม่)
func CreateReview(c *gin.Context) {
    var review entity.Review
    db := config.DB()

    // แปลง JSON ที่ได้รับเป็น Review Entity
    if err := c.ShouldBindJSON(&review); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    // ตรวจสอบว่ามี review อยู่แล้วหรือไม่ โดยใช้ user_id และ rent_id
    var existingReview entity.Review
    result := db.Where("user_id = ? AND rent_id = ?", review.UserID, review.RentID).First(&existingReview)

    if result.RowsAffected > 0 {
        // ถ้ามี review อยู่แล้ว ให้อัปเดตแทนการสร้างใหม่
        existingReview.Comment = review.Comment
        existingReview.Score = review.Score
        existingReview.TimeEdit = time.Now()

        db.Save(&existingReview)
        c.JSON(http.StatusOK, gin.H{"message": "Review updated successfully"})
        return
    }

    // ถ้าไม่มี review ใหญ่บันทึก review ใหม่ลงฐานข้อมูล
    review.TimeComment = time.Now() // ตั้งเวลา comment
    result = db.Save(&review)
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Review added successfully"})
}

// Get - ดึงรีวิวตาม ID
func Get(c *gin.Context) {
	ID := c.Param("id")
	var review entity.Review

	db := config.DB()
	results := db.First(&review, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if review.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, review)
}

// Update - อัปเดตรีวิว
// UpdateReview - อัปเดตข้อมูลรีวิว
func UpdateReview(c *gin.Context) {
	rentId := c.Param("id")
	var review entity.Review

	db := config.DB()
	if err := db.First(&review, rentId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	// รับข้อมูลใหม่ที่ต้องการอัปเดต
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to map payload"})
		return
	}

	review.TimeEdit = time.Now()
	if err := db.Save(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update review"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review updated successfully"})
}

// Delete - ลบรีวิวตาม ID
func Delete(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM reviews WHERE id = ?", ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Review deleted successfully"})
}

// GetReviewsByUserId - ดึงข้อมูลรีวิวตาม userId
// GetReviewByRentId - ดึงรีวิวตาม rent_id
// func GetReviewByRentId(c *gin.Context) {
//     rentId := c.Param("id")
//     var review entity.Review

//     db := config.DB()

//     // แปลง rentId จาก string เป็น int
//     intRentId, err := strconv.Atoi(rentId)
//     if err != nil {
//         c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid rent ID"})
//         return
//     }

//     // ตรวจสอบว่าเจอ rent_id นี้ไหม
//     if err := db.Where("rent_id = ?", intRentId).First(&review).Error; err != nil {
//         // ถ้าไม่เจอ ลองหา rent_id - 1 แทน
//         newRentId := intRentId - 1
//         if err := db.Where("rent_id = ?", newRentId).First(&review).Error; err != nil {
//             c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
//             return
//         }
//     }
    
//     c.JSON(http.StatusOK, review)
// }



// // GetReviewsByRentId - ดึงข้อมูลรีวิวตาม rentId
// func GetReviewsByRentId(c *gin.Context) {
// 	rentId := c.Param("rentId")
// 	var review []entity.Review

// 	db := config.DB()
// 	if err := db.Where("rent_id = ?", rentId).Find(&review).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Reviews not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, review)
// }
