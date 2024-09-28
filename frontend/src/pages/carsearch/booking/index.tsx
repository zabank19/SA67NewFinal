import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetCarById, CreateRent, CreateReview } from "../../../services/https"; // เพิ่ม CreateReview
import { CarInterface } from "../../../interfaces/ICar";
import { DatePicker, Button, Typography, message, Card } from "antd";
import { RentInterface } from "../../../interfaces/IRent";
import { ReviewInterface } from "../../../interfaces/IReview"; // เพิ่ม ReviewInterface
import dayjs from "dayjs";

const { Title, Text } = Typography;

const BookingPage = () => {
    const { carId } = useParams<{ carId: string }>(); // Get carId from URL
    const navigate = useNavigate();
    const [car, setCar] = useState<CarInterface | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [userID, setUserID] = useState<number | null>(null); // State for userID
    const [messageApi, contextHolder] = message.useMessage();

    // Fetch car details
    const fetchCarDetails = async () => {
        try {
            const res = await GetCarById(carId); // Fetch car details
            setCar(res);
            // Extract userID from localStorage
            const storedUserID = localStorage.getItem("id");
            setUserID(storedUserID ? parseInt(storedUserID, 10) : null);
        } catch (error) {
            messageApi.error("Failed to fetch car details");
        }
    };

    useEffect(() => {
        if (carId) {
            fetchCarDetails(); // Fetch car details when carId is available
        }
    }, [carId]);

    const calculatePrice = (): number => {
        if (startDate && endDate && car) {
            // Calculate the difference in days between start and end date, inclusive of end date
            const diffInDays = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
            // Calculate the total price
            const totalPrice = diffInDays * car.price;
            return totalPrice;
        }
        return 0;
    };

    const handleBooking = async () => {
        if (startDate && endDate && car && userID) {
            const price = calculatePrice();
            const currentDate = dayjs().startOf('day'); // Current date (starting at 00:00)

            // Validate that startDate and endDate are not in the past
            if (dayjs(startDate).isBefore(currentDate) || dayjs(endDate).isBefore(currentDate)) {
                messageApi.error("Cannot book for past dates");
                return;
            }

            // Validate that endDate is after startDate
            if (dayjs(startDate).isAfter(dayjs(endDate))) {
                messageApi.error("End date must be after the start date");
                return;
            }

            // Validate that booking must be for at least 1 day
            const diffInDays = dayjs(endDate).diff(dayjs(startDate), 'day');
            if (diffInDays < 0) { // diffInDays < 0 means the dates are the same
                messageApi.error("Booking must be for at least 1 day");
                return;
            }

            // Validate that price is greater than 0
            if (price <= 0) {
                messageApi.error("Invalid price calculated");
                return;
            }

            try {
                const data: RentInterface = {
                    start_rent:  dayjs(startDate).endOf('day').toISOString(),
                    end_rent: dayjs(endDate).endOf('day').toISOString(), // Ensure end date is inclusive
                    price: price,
                    car_id: car.ID,
                    user_id: userID,
                    status: 'Pending Payment',
                };

                const response = await CreateRent(data);

                // Check the response for rent_id
                if (response && response.rent_id) { // Check if rent_id is in the response
                    // After creating the booking, create an empty review
                    const reviewData: ReviewInterface = {
                        user_id: userID,
                        rent_id: response.rent_id, // Reference the newly created rent
                        comment: "", // Empty comment initially
                        score: 0, // Default score
                        time_comment: new Date(),
                    };
                    await CreateReview(reviewData); // Create an empty review

                    messageApi.success("Booking successfully created!");
                    // Use the returned rent_id to navigate to the payment page
                    navigate(`/rent/payment/${response.rent_id}`, { state: { price: price, car: car } });
                } else {
                    messageApi.error("วันที่คุณเลือกรถได้ถูกจองไปแล้ว");
                }
            } catch (error) {
                console.error('Error creating booking:', error);
                const errorMessage = error instanceof Error ? error.message : "Failed to create booking";
                messageApi.error(`Failed to create booking: ${errorMessage}`);
            }
        } else {
            messageApi.error("Please select start and end dates, and ensure all data is available");
        }
    };

    const handleCancel = () => {
        navigate("/rent"); // Navigate to car selection page
    };

    return (
        <div style={{ 
            padding: '20px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontFamily: 'Kanit, sans-serif', // Apply Kanit font to the entire container
        }}>
            {contextHolder}
            {car ? (
                <Card style={{ 
                    maxWidth: '600px', 
                    width: '100%', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'Kanit, sans-serif', // Apply Kanit font to card
                }}>
                    <img src={car.picture} alt={car.license_plate} style={{ 
                        width: '100%', 
                        height: 'auto', 
                        borderRadius: '8px', // Rounded corners for image
                        marginBottom: '20px' 
                    }} />
                    
                    <Title level={3} style={{ textAlign: 'center', fontFamily: 'Kanit, sans-serif' }}>{car.license_plate}</Title>
                    <Text style={{ fontFamily: 'Kanit, sans-serif' }}>Brand: {car.brands}</Text><br />
                    <Text style={{ fontFamily: 'Kanit, sans-serif' }}>Model Year: {car.model_year}</Text><br />
                    <Text style={{ fontFamily: 'Kanit, sans-serif' }}>Province: {car.province}</Text><br />
                    <Text style={{ fontFamily: 'Kanit, sans-serif' }}>Status: {car.status}</Text><br />

                    <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                        <Text strong style={{ fontFamily: 'Kanit, sans-serif' }}>Day First Booked:</Text>
                        <DatePicker
                            onChange={(date) => setStartDate(date ? date.toDate() : null)}
                            placeholder="Select Start Date"
                            style={{ width: '100%', marginBottom: '10px' }} // Full width with margin bottom
                        />
                        <Text strong style={{ fontFamily: 'Kanit, sans-serif' }}>Book Until:</Text>
                        <DatePicker
                            onChange={(date) => setEndDate(date ? date.toDate() : null)}
                            placeholder="Select End Date"
                            style={{ width: '100%' }} // Full width
                        />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            onClick={handleBooking}
                            style={{ 
                                marginRight: '10px', 
                                fontFamily: 'Kanit, sans-serif', // Apply Kanit font to button
                            }}
                        >
                            Confirm Booking
                        </Button>
                        <Button
                            type="default"
                            onClick={handleCancel}
                            style={{ fontFamily: 'Kanit, sans-serif' }} // Apply Kanit font to button
                        >
                            Cancel
                        </Button>
                    </div>
                </Card>
            ) : (
                <Text style={{ fontFamily: 'Kanit, sans-serif' }}>Loading...</Text>
            )}
        </div>
    );
};

export default BookingPage;
