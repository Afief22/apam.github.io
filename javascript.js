
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
                            top: targetElement.offsetTop - 80, // Sesuaikan dengan tinggi header
                            behavior: 'smooth'
                        });

                        // Sembunyikan menu mobile setelah klik
                        if (window.innerWidth <= 768) {
                            navLinks.classList.remove('show');
                        }
                    }
                });
            });
            
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
            
            // Add to cart buttons
            const addToCartBtns = document.querySelectorAll('.add-to-cart');
            
            addToCartBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const type = this.getAttribute('data-type');
                    const input = document.getElementById(`qty-${type}`);
                    let value = parseInt(input.value);
                    
                    if (value === 0) {
                        input.value = 1;
                    }
                    
                    updateOrderSummary();
                    
                    // Scroll to order form
                    document.getElementById('order').scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
            
            // Update order summary
            function updateOrderSummary() {
                const qtyMerah = parseInt(document.getElementById('qty-merah').value) || 0;
                const qtyPutih = parseInt(document.getElementById('qty-putih').value) || 0;
                
                const orderSummary = document.getElementById('order-summary');
                
                if (qtyMerah === 0 && qtyPutih === 0) {
                    orderSummary.innerHTML = '<p style="color: var(--gray); text-align: center;">Belum ada item dipesan</p>';
                    return;
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
                        <div style="display: flex; justify-content: space-between; font-weight: bold;">
                            <span>Total</span>
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
                
                const name = document.getElementById('name').value;
                const phone = document.getElementById('phone').value;
                const address = document.getElementById('address').value;
                const notes = document.getElementById('notes').value;
                const qtyMerah = parseInt(document.getElementById('qty-merah').value) || 0;
                const qtyPutih = parseInt(document.getElementById('qty-putih').value) || 0;
                
                if (qtyMerah === 0 && qtyPutih === 0) {
                    alert('Silakan pilih minimal 1 apam untuk dipesan');
                    return;
                }
                
                // Format WhatsApp message
                let message = `*PESANAN APAM BANJARMASIN*\n\n`;
                message += `*Data Pemesan:*\n`;
                message += `Nama : ${name}\n`;
                message += `Nomor WA : ${phone}\n`;
                message += `Alamat : ${address}\n\n`;
                
                message += `*Detail Pesanan:*\n`;
                let total = 0;
                
                if (qtyMerah > 0) {
                    const subtotal = qtyMerah * 15000;
                    total += subtotal;
                    message += `- Apam Merah: ${qtyMerah} pcs × Rp15.000 = Rp ${subtotal.toLocaleString('id-ID')}\n`;
                }
                
                if (qtyPutih > 0) {
                    const subtotal = qtyPutih * 12000;
                    total += subtotal;
                    message += `- Apam Putih: ${qtyPutih} pcs × Rp12.000 = Rp ${subtotal.toLocaleString('id-ID')}\n`;
                }
                
                message += `\n*Total Pesanan: Rp ${total.toLocaleString('id-ID')}*\n`;
                
                if (notes) {
                    message += `\n*Catatan Tambahan:*\n${notes}\n`;
                }
                
                message += `\nTerima kasih atas pesanannya! Kami akan segera memproses pesanan Anda.`;
                
                // Encode message for WhatsApp URL
                const encodedMessage = encodeURIComponent(message);
                
                // Open WhatsApp dengan nomor 085161050904 (format internasional: 6285161050904)
                window.open(`https://wa.me/6287877617078?text=${encodedMessage}`, '_blank');
            });
        });