import { Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import './landingPage.css'

const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <header>
        <div class="container">
            <nav>
                <div class="menu-logo-landing">
                    <i class="fas fa-boxes"></i>
                    <span>HomeStock</span>
                </div>
                <ul class="nav-links">
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how-it-works">How It Works</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                    <li><Link to="/login" class="btn">Get Started</Link></li>
                </ul>
            </nav>
        </div>
    </header>
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1>Smart <span>Home Inventory</span> Management Made Easy</h1>
                    <p>Track, organize, and manage everything in your home with our intuitive stock management system. Never run out of essentials or lose track of your belongings again.</p>
                    <div class="hero-btns">
                        <Link to="/login" class="btn btn-primary">Get Start</Link>
                        <Link to="#" class="btn btn-outline">Learn More</Link>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Home Inventory Management"/>
                </div>
            </div>
        </div>
    </section>
    
    <section class="features" id="features">
        <div class="container">
            <div class="section-title">
                <h2>Powerful Features</h2>
                <p>HomeStock comes packed with everything you need to manage your home inventory efficiently</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-barcode"></i>
                    </div>
                    <h3>Barcode Scanning</h3>
                    <p>Quickly add items to your inventory by scanning barcodes with your smartphone camera.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-bell"></i>
                    </div>
                    <h3>Low Stock Alerts</h3>
                    <p>Get notifications when your items are running low so you can restock in time.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h3>Usage Analytics</h3>
                    <p>Track consumption patterns and optimize your shopping habits with detailed reports.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3>Family Sharing</h3>
                    <p>Share your inventory with family members and collaborate on household management.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-tags"></i>
                    </div>
                    <h3>Expiration Tracking</h3>
                    <p>Never waste food again with expiration date tracking and alerts.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h3>Mobile App</h3>
                    <p>Access your inventory anywhere with our iOS and Android mobile applications.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="how-it-works" id="how-it-works">
        <div class="container">
            <div class="section-title">
                <h2>How It Works</h2>
                <p>Get started with HomeStock in just a few simple steps</p>
            </div>
            <div class="steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <h3>Sign Up</h3>
                    <p>Create your free account in less than a minute with just your email address.</p>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <h3>Add Items</h3>
                    <p>Scan barcodes or manually add items to build your home inventory database.</p>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <h3>Organize</h3>
                    <p>Categorize items by room, type, or custom tags for easy searching.</p>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <h3>Track & Manage</h3>
                    <p>Monitor quantities, set alerts, and enjoy a perfectly stocked home.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="testimonials" id="testimonials">
        <div class="container">
            <div class="section-title">
                <h2>What Our Users Say</h2>
                <p>Don't just take our word for it - hear from our satisfied customers</p>
            </div>
            <div class="testimonial-grid">
                <div class="testimonial-card">
                    <div class="testimonial-text">
                        "HomeStock has completely transformed how we manage our pantry. No more guessing what we have or need!"
                    </div>
                    <div class="testimonial-author">
                        <div class="author-img">
                            <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah J."/>
                        </div>
                        <div class="author-info">
                            <h4>Sarah J.</h4>
                            <p>Busy Mom of 3</p>
                        </div>
                    </div>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-text">
                        "As someone who loves to cook, keeping track of spices and ingredients was a nightmare. HomeStock solved all that!"
                    </div>
                    <div class="testimonial-author">
                        <div class="author-img">
                            <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Michael T."/>
                        </div>
                        <div class="author-info">
                            <h4>Michael T.</h4>
                            <p>Home Chef</p>
                        </div>
                    </div>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-text">
                        "The expiration alerts alone have saved me hundreds of dollars in wasted food. Worth every penny!"
                    </div>
                    <div class="testimonial-author">
                        <div class="author-img">
                            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Lisa M."/>
                        </div>
                        <div class="author-info">
                            <h4>Lisa M.</h4>
                            <p>Frugal Living Blogger</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="cta">
        <div class="container">
            <h2>Ready to Transform Your Home Management?</h2>
            <p>Join thousands of happy households who have simplified their lives with HomeStock</p>
            <a href="#" class="btn">Start Your Free 30-Day Trial</a>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-column">
                    <h3>HomeStock</h3>
                    <p>The smart way to manage your home inventory and never run out of essentials again.</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                <div class="footer-column">
                    <h3>Product</h3>
                    <ul>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Mobile Apps</a></li>
                        <li><a href="#">Integrations</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Resources</h3>
                    <ul>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Tutorials</a></li>
                        <li><a href="#">API Docs</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 HomeStock. All rights reserved.</p>
            </div>
        </div>
    </footer>

    </div>
  );
};

export default LandingPage;