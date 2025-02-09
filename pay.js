(function () {
    async function pay({ orderAmount }) {
        const statusBox = document.querySelector('.status');
        statusBox.textContent = "🔄 Generating Payment Address...";
        
        try {
            const response = await fetch('https://flashusdtpayment.vercel.app/api/create-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: orderAmount })
            });

            const data = await response.json();
            if (data.paymentAddress) {
                statusBox.innerHTML = `
                    ✅ Payment Address: <b>${data.paymentAddress}</b><br>
                    ⏳ Send <b>${orderAmount} USDT</b> to complete the payment.
                `;
                
                checkPaymentStatus(data.paymentAddress);
            } else {
                statusBox.textContent = "❌ Payment Failed. Try Again.";
            }
        } catch (error) {
            statusBox.textContent = "❌ Error Processing Payment.";
        }
    }

    async function checkPaymentStatus(paymentAddress) {
        const statusBox = document.querySelector('.status');
        let retries = 0;

        const checkInterval = setInterval(async () => {
            retries++;
            statusBox.textContent = `🔍 Checking payment status (${retries})...`;

            const response = await fetch(`https://flashusdtpayment.vercel.app/api/check-payment?address=${paymentAddress}`);
            const result = await response.json();

            if (result.status === "confirmed") {
                clearInterval(checkInterval);
                statusBox.innerHTML = "✅ Payment Confirmed!";
            } else if (retries >= 10) {
                clearInterval(checkInterval);
                statusBox.innerHTML = "⚠️ Payment Not Detected. Try Again.";
            }
        }, 5000);
    }

    window.pay = pay;
})();
