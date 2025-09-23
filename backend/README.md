# AgaPay Backend

A FastAPI-based payment processing backend for Ghana.

## Features

- **Payment Processing**: Support for card, mobile money, and bank transfers
- **Paystack Integration**: Full integration with Paystack for Ghanaian payments
- **Mobile Money**: Support for MTN, AirtelTigo, and Vodafone mobile money
- **JWT Authentication**: Secure user authentication system
- **Database Models**: PostgreSQL with SQLAlchemy
- **Webhook Support**: Real-time payment status updates
- **API Documentation**: Auto-generated OpenAPI docs

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `PAYSTACK_SECRET_KEY`: Your Paystack secret key
- `PAYSTACK_PUBLIC_KEY`: Your Paystack public key
- `SECRET_KEY`: JWT secret key

### 3. Database Setup

```bash
# Initialize database
alembic upgrade head
```

### 4. Start the Server

```bash
python start.py
```

The server will be available at `http://localhost:8000`

## API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Payments
- `POST /api/payments/initialize` - Initialize payment
- `POST /api/payments/mobile-money` - Process mobile money payment
- `GET /api/payments/verify/{reference}` - Verify payment
- `POST /api/payments/webhook` - Paystack webhook handler
- `GET /api/payments/stats` - Get payment statistics
- `GET /api/payments/` - Get all payments

### Users
- `GET /api/users/` - Get all users
- `GET /api/users/{user_id}` - Get specific user
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

## Mobile Money Support

The backend supports Ghanaian mobile money providers:

- **MTN**: Mobile money payments
- **AirtelTigo**: Mobile money payments
- **Vodafone**: Mobile money payments

## Paystack Integration

The backend integrates with Paystack for:

- Card payments
- Mobile money payments
- Bank transfers
- Transaction verification
- Webhook handling

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation with Pydantic
- CORS configuration
- Webhook signature verification

## Testing

```bash
# Run tests (if implemented)
pytest
```

## Deployment

### Environment Variables for Production

- Set strong `SECRET_KEY`
- Use production Paystack keys
- Use production database URL
- Set up proper CORS origins
- Configure Redis for session management

### Database Migrations

```bash
# Generate migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.