import React from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button, Typography, message, Card } from "antd";
import { UpdateRentById, DeleteRentById } from "../../../services/https"; // Import from your service

const { Title, Text } = Typography;

const PaymentPage = () => {
    const { bookingId } = useParams<{ bookingId: string }>(); // Get bookingId from URL
    const location = useLocation();
    const navigate = useNavigate();
    const { price } = location.state as { price: number }; // Get price from state

    const handlePayment = async () => {
        try {
            await UpdateRentById(Number(bookingId), { status: 'paymented' });
            message.success("การชำระเงินสำเร็จ!");
            navigate("/rent");
        } catch (error) {
            console.error('Error updating rent status:', error);
            message.error("การชำระเงินล้มเหลว: " + error.message);
        }
    };
    
    const handleCancel = async () => {
        try {
            await DeleteRentById(Number(bookingId));
            message.success("การยกเลิกการจองสำเร็จ!");
            navigate("/rent");
        } catch (error) {
            console.error('Error deleting rent:', error);
            message.error("การยกเลิกการจองล้มเหลว: " + error.message);
        }
    };
    
    const phoneNumber = "0844102215";
    const amount = price ? price.toFixed(2) : "0.00";
    const qrCodeUrl = `https://promptpay.io/${phoneNumber}/${amount}`;

    return (
        <div style={{ 
            padding: '20px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontFamily: 'Kanit, sans-serif', // Apply Kanit font to the entire container
        }}>
            <Card style={{ 
                maxWidth: '600px', 
                width: '100%', 
                padding: '20px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Kanit, sans-serif', // Apply Kanit font to card
            }}>
                <Title level={3} style={{ textAlign: 'center' }}>Payment for Booking</Title>
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <img src={qrCodeUrl} alt="PromptPay QR Code" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
                </div>
                <Card style={{ 
                    textAlign: 'center', 
                    marginTop: '20px', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'Kanit, sans-serif' // Apply Kanit font to inner card
                }}>
                    <Text>Total Amount: {price ? `${price} THB` : "Price not available"}</Text>
                </Card>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button 
                        type="primary" 
                        onClick={handlePayment} 
                        style={{ 
                            marginRight: '10px', 
                            fontFamily: 'Kanit, sans-serif' // Apply Kanit font to button
                        }}
                    >
                        Process Payment
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
        </div>
    );
};

export default PaymentPage;
