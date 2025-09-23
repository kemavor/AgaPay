import httpx
import base64
import hashlib
import hmac
from typing import Dict, Any, Optional
from core.config import settings


class PaystackService:
    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY
        self.base_url = "https://api.paystack.co"
        self.headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json"
        }

    async def initialize_transaction(
        self,
        amount: int,
        email: str,
        reference: str,
        callback_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """Initialize a transaction with Paystack"""

        payload = {
            "amount": amount,
            "email": email,
            "reference": reference,
            "currency": "GHS"
        }

        if callback_url:
            payload["callback_url"] = callback_url

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/transaction/initialize",
                headers=self.headers,
                json=payload
            )

            return response.json()

    async def initialize_mobile_money(
        self,
        amount: int,
        email: str,
        phone: str,
        provider: str = "mtn"
    ) -> Dict[str, Any]:
        """Initialize mobile money payment for Ghana"""

        payload = {
            "amount": amount,
            "email": email,
            "currency": "GHS",
            "mobile_money": {
                "phone": phone,
                "provider": provider
            }
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/charge",
                headers=self.headers,
                json=payload
            )

            return response.json()

    async def submit_mobile_money(
        self,
        amount: int,
        email: str,
        phone: str,
        provider: str,
        reference: str
    ) -> Dict[str, Any]:
        """Submit mobile money payment"""

        payload = {
            "amount": amount,
            "email": email,
            "currency": "GHS",
            "reference": reference,
            "mobile_money": {
                "phone": phone,
                "provider": provider
            }
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/charge",
                headers=self.headers,
                json=payload
            )

            return response.json()

    async def verify_transaction(self, reference: str) -> Dict[str, Any]:
        """Verify a transaction"""

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/transaction/verify/{reference}",
                headers=self.headers
            )

            return response.json()

    async def get_transaction(self, transaction_id: str) -> Dict[str, Any]:
        """Get transaction details"""

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/transaction/{transaction_id}",
                headers=self.headers
            )

            return response.json()

    async def get_transactions(
        self,
        per_page: int = 50,
        page: int = 1,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get all transactions"""

        params = {
            "perPage": per_page,
            "page": page
        }

        if from_date:
            params["from"] = from_date
        if to_date:
            params["to"] = to_date

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/transaction",
                headers=self.headers,
                params=params
            )

            return response.json()

    async def charge_authorization(
        self,
        authorization_code: str,
        email: str,
        amount: int
    ) -> Dict[str, Any]:
        """Charge a customer using authorization code"""

        payload = {
            "authorization_code": authorization_code,
            "email": email,
            "amount": amount,
            "currency": "GHS"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/transaction/charge_authorization",
                headers=self.headers,
                json=payload
            )

            return response.json()

    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """Verify Paystack webhook signature"""

        computed_signature = hmac.new(
            self.secret_key.encode('utf-8'),
            payload,
            hashlib.sha512
        ).hexdigest()

        return hmac.compare_digest(computed_signature, signature)

    async def get_banks(self, country: str = "ghana") -> Dict[str, Any]:
        """Get list of banks for Ghana"""

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/bank?country={country}",
                headers=self.headers
            )

            return response.json()

    async def resolve_account_number(
        self,
        account_number: str,
        bank_code: str
    ) -> Dict[str, Any]:
        """Resolve bank account number"""

        payload = {
            "account_number": account_number,
            "bank_code": bank_code
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/bank/resolve",
                headers=self.headers,
                json=payload
            )

            return response.json()

    async def create_transfer_recipient(
        self,
        account_number: str,
        bank_code: str,
        account_name: str
    ) -> Dict[str, Any]:
        """Create transfer recipient"""

        payload = {
            "type": "nuban",
            "name": account_name,
            "account_number": account_number,
            "bank_code": bank_code,
            "currency": "GHS"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/transferrecipient",
                headers=self.headers,
                json=payload
            )

            return response.json()

    async def initiate_transfer(
        self,
        amount: int,
        recipient_code: str,
        reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """Initiate transfer"""

        payload = {
            "source": "balance",
            "amount": amount,
            "recipient": recipient_code,
            "currency": "GHS"
        }

        if reason:
            payload["reason"] = reason

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/transfer",
                headers=self.headers,
                json=payload
            )

            return response.json()

    async def finalize_transfer(
        self,
        transfer_code: str,
        otp: str
    ) -> Dict[str, Any]:
        """Finalize transfer with OTP"""

        payload = {
            "transfer_code": transfer_code,
            "otp": otp
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/transfer/finalize_transfer",
                headers=self.headers,
                json=payload
            )

            return response.json()