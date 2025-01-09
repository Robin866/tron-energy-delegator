document.addEventListener('DOMContentLoaded', () => {
    const delegateButton = document.getElementById('delegateButton');
    const walletAddressInput = document.getElementById('walletAddress');
    const messageDiv = document.getElementById('message');
    const errorDiv = document.getElementById('error');
  
    // Check localStorage to see if the button should be disabled
    const disableUntil = localStorage.getItem('disableUntil');
    const currentTime = Date.now();
  
    if (disableUntil && currentTime < parseInt(disableUntil, 10)) {
      disableButton(delegateButton, parseInt(disableUntil, 10) - currentTime);
    }
  
    // Add click event listener for the button
    delegateButton.addEventListener('click', async () => {
      const walletAddress = walletAddressInput.value;
      messageDiv.textContent = '';
      errorDiv.textContent = '';
  
      if (!walletAddress) {
        errorDiv.textContent = 'Please enter a valid wallet address.';
        return;
      }
  
      // Disable button immediately and record the disable time
      disableButton(delegateButton, 3 * 60 * 1000); // Disable for 3 minutes
      localStorage.setItem('disableUntil', Date.now() + 3 * 60 * 1000);
  
      try {
        const response = await fetch('https://tron-energy-delegator.onrender.com/delegate', {
        //const response = await fetch('http://localhost:3000/delegate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          messageDiv.textContent = `Successfully delegated 65000 energy to ${walletAddress}`;
        } else {
          errorDiv.textContent = result.message || 'Failed to delegate energy.';
          // If the request fails, re-enable the button immediately
          enableButton(delegateButton);
          localStorage.removeItem('disableUntil');
        }
      } catch (error) {
        errorDiv.textContent = 'An error occurred while processing your request.';
        // If the request fails, re-enable the button immediately
        enableButton(delegateButton);
        localStorage.removeItem('disableUntil');
      }
    });
  
    // Function to disable the button
    function disableButton(button, duration) {
      button.disabled = true;
      button.textContent = `Please wait ${(duration / 1000).toFixed(0)} seconds...`;
  
      const interval = setInterval(() => {
        const remainingTime = parseInt(localStorage.getItem('disableUntil'), 10) - Date.now();
        if (remainingTime <= 0) {
          clearInterval(interval);
          enableButton(button);
          localStorage.removeItem('disableUntil');
        } else {
          button.textContent = `Please wait ${(remainingTime / 1000).toFixed(0)} seconds...`;
        }
      }, 1000);
    }
  
    // Function to enable the button
    function enableButton(button) {
      button.disabled = false;
      button.textContent = 'Delegate Energy';
    }
  });