document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('show');
    });
    
    // Update display on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('show');
        }
    });

    // Smooth scrolling
    const navLinksA = document.querySelectorAll('.nav-links a');

    navLinksA.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Hide mobile menu after click
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('show');
                }
            }
        });
    });
    
    // Add minimum order info
    // const productGrid = document.querySelector('.product-grid');
    // const messageElement = document.createElement('div');
    // messageElement.className = 'min-order-message';
    // messageElement.innerHTML = '📢 Minimal order 50 pcs (boleh dicampur antara varian)';
    // productGrid.insertBefore(messageElement, productGrid.firstChild);
    
    // Quantity controls
    const quantityBtns = document.querySelectorAll('.qty-btn');
    
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const type = this.getAttribute('data-type');
            const input = document.getElementById(`qty-${type}`);
            let value = parseInt(input.value);
            
            if (this.classList.contains('minus')) {
                if (value > 0) {
                    input.value = value - 1;
                }
            } else if (this.classList.contains('plus')) {
                input.value = value + 1;
            }
            
            updateOrderSummary();
        });
    });
    
    // Direct input validation
    const quantityInputs = document.querySelectorAll('.qty-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 0) this.value = 0;
            updateOrderSummary();
        });
    });
    
    // Update order summary
    function updateOrderSummary() {
        const qtyMerah = parseInt(document.getElementById('qty-merah').value) || 0;
        const qtyPutih = parseInt(document.getElementById('qty-putih').value) || 0;
        const totalQty = qtyMerah + qtyPutih;
        
        const orderSummary = document.getElementById('order-summary');
        
        // Highlight if minimum order not met
        if (totalQty > 0 && totalQty < 50) {
            orderSummary.style.border = '2px solid #e74c3c';
            orderSummary.style.padding = '13px';
            orderSummary.innerHTML = `
                <div style="color: #e74c3c; margin-bottom: 10px;">
                    ⚠ Total pesanan ${totalQty} pcs (minimal 50 pcs)
                </div>
            `;
            return;
        } else if (totalQty === 0) {
            orderSummary.style.border = 'none';
            orderSummary.style.padding = '15px';
            orderSummary.innerHTML = '<p style="color: var(--gray); text-align: center;">Belum ada item dipesan</p>';
            return;
        } else {
            orderSummary.style.border = 'none';
            orderSummary.style.padding = '15px';
        }
        
        let summaryHTML = '<ul style="list-style: none; margin-bottom: 15px;">';
        let total = 0;
        
        if (qtyMerah > 0) {
            const subtotal = qtyMerah * 1500;
            total += subtotal;
            summaryHTML += `
                <li style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Apam Merah x${qtyMerah}</span>
                    <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
                </li>
            `;
        }
        
        if (qtyPutih > 0) {
            const subtotal = qtyPutih * 1500;
            total += subtotal;
            summaryHTML += `
                <li style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Apam Putih x${qtyPutih}</span>
                    <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
                </li>
            `;
        }
        
        summaryHTML += '</ul>';
        summaryHTML += `
            <div style="border-top: 1px dashed #ddd; padding-top: 10px; margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Total Item</span>
                    <span>${totalQty} pcs</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                    <span>Total Harga</span>
                    <span>Rp ${total.toLocaleString('id-ID')}</span>
                </div>
            </div>
        `;
        
        orderSummary.innerHTML = summaryHTML;
    }
    
    // Form submission
    const orderForm = document.getElementById('orderForm');
    
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const notes = document.getElementById('notes').value.trim();
        const qtyMerah = parseInt(document.getElementById('qty-merah').value) || 0;
        const qtyPutih = parseInt(document.getElementById('qty-putih').value) || 0;
        const totalQty = qtyMerah + qtyPutih;
        
        // Validate minimum order
        if (totalQty < 50) {
            alert('Mohon maaf, minimal order adalah 50 pcs (boleh dicampur antara varian).\n\nTotal pesanan Anda saat ini: ' + totalQty + ' pcs');
            return;
        }
        
        // Validate required fields
        if (!name || !phone || !address) {
            alert('Harap lengkapi semua data pemesan (Nama, Nomor WhatsApp, dan Alamat)');
            return;
        }
        
        // Format WhatsApp message
        let message = `*PESANAN APAM ALABIO IFAH*\n\n`;
        message += `*DATA PEMESAN*\n`;
        message += `▸ Nama : ${name}\n`;
        message += `▸ Nomor WA : ${phone}\n`;
        message += `▸ Alamat : ${address}\n\n`;
        
        message += `*DETAIL PESANAN*\n`;
        let total = 0;
        
        if (qtyMerah > 0) {
            const subtotal = qtyMerah * 1500;
            total += subtotal;
            message += `▸ Apam Merah: ${qtyMerah} pcs × Rp1.500 = Rp ${subtotal.toLocaleString('id-ID')}\n`;
        }
        
        if (qtyPutih > 0) {
            const subtotal = qtyPutih * 1500;
            total += subtotal;
            message += `▸ Apam Putih: ${qtyPutih} pcs × Rp1.500 = Rp ${subtotal.toLocaleString('id-ID')}\n`;
        }
        
        message += `\n*TOTAL PESANAN*\n`;
        message += `▸ Jumlah Item: ${totalQty} pcs\n`;
        message += `▸ Total Harga: Rp ${total.toLocaleString('id-ID')}\n`;
        
        if (notes) {
            message += `\n*CATATAN TAMBAHAN*\n${notes}\n`;
        }
        
        message += `\nTerima kasih atas pesanannya! Pesanan ini akan kami proses setelah konfirmasi pembayaran.`;
        
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp
        window.open(`https://wa.me/6287877617078?text=${encodedMessage}`, '_blank');
    });
});