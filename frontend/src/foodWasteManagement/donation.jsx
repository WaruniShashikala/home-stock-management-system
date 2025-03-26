import React from 'react';
import './Donation.css';

function Donation() {
    return (
        <div className="donation-container">
            <div className="content-wrapper">
                <main className="main-content">
                    <section className="donation-section">
                        <h2>Donation Opportunities</h2>
                        <h3>Why Donate?</h3>
                        <div className="why-donate-content">
                            <div className="why-donate-text">
                                <p>
                                    When you have food that's still good but you can't use it, donating helps:
                                </p>
                                <ul>
                                    <li>Reduce waste going to landfills</li>
                                    <li>Support community members in need</li>
                                    <li>Convert potential waste into nutritious meals</li>
                                    <li>Potentially qualify for tax deductions (check with donation centers)</li>
                                </ul>
                                <p>
                                    Many items approaching their "best by" date are still perfectly safe to eat and can be donated rather than thrown away.
                                </p>
                            </div>
                            <div className="why-donate-image">
                                <img src="https://brownliving.in/cdn/shop/articles/food-donation-services-988981.jpg?v=1703200384" alt="Benefits of food donation" />
                            </div>
                        </div>
                    </section>

                    <hr className="section-divider" />

                    {/* Section 2: Local Donation Centers */}
                    <section className="donation-section">
                        <h3>Local Donation Centers</h3>

                        <div className="donation-centers-container">
                            {/* Community Food Bank */}
                            <div className="donation-center-card">
                                <div className="center-image-container">
                                    <img
                                        src="https://scottsdalecommunitypartners.org/app/uploads/2022/01/local-community-needs-food-bank.webp"
                                        alt="Community Food Bank"
                                        className="center-image"
                                    />
                                </div>
                                <div className="center-info">
                                    <h4>Community Food Bank</h4>
                                    <p>Accepts non-perishable food items and fresh produce for distribution to those in need.</p>
                                    <p className="center-address">© 123 Main Street, Anytown</p>
                                    <p className="phone-number">(555) 123-4567</p>
                                </div>
                                <div className="accepts-section">
                                    <p><strong>Accepts:</strong></p>
                                    <ul className="accepts-items">
                                        <li>Non-perishable food</li>
                                        <li>Fresh produce</li>
                                        <li>Canned goods</li>
                                    </ul>
                                </div>
                                <button className="visit-website">Visit Website ☑</button>
                            </div>

                            {/* Homeless Shelter */}
                            <div className="donation-center-card">
                                <div className="center-image-container">
                                    <img
                                        src="https://regenbrampton.com/wp-content/uploads/2021/02/shutterstock_694710103.jpg"
                                        alt="Homeless Shelter"
                                        className="center-image"
                                    />
                                </div>
                                <div className="center-info">
                                    <h4>Homeless Shelter</h4>
                                    <p>Provides meals to homeless individuals and families. Accepts prepared food with certain restrictions.</p>
                                    <p className="center-address">© 456 Oak Avenue, Anytown</p>
                                    <p className="phone-number">(555) 987-6543</p>
                                </div>
                                <div className="accepts-section">
                                    <p><strong>Accepts:</strong></p>
                                    <ul className="accepts-items">
                                        <li>Prepared meals</li>
                                        <li>Packaged foods</li>
                                        <li>Fresh fruits</li>
                                    </ul>
                                </div>
                                <button className="visit-website">Visit Website ☑</button>
                            </div>

                            {/* Animal Rescue Center */}
                            <div className="donation-center-card">
                                <div className="center-image-container">
                                    <img
                                        src="https://images.wagwalkingweb.com/media/daily_wag/blog_articles/hero/1651153661.2751184/a-day-in-the-life-of-an-animal-shelter-volunteer.png"
                                        alt="Animal Rescue Center"
                                        className="center-image"
                                    />
                                </div>
                                <div className="center-info">
                                    <h4>Animal Rescue Center</h4>
                                    <p>Accepts certain types of food items that can be used for animal feed.</p>
                                    <p className="center-address">© 789 Pine Road, Anytown</p>
                                    <p className="phone-number">(555) 234-5678</p>
                                </div>
                                <div className="accepts-section">
                                    <p><strong>Accepts:</strong></p>
                                    <ul className="accepts-items">
                                        <li>Vegetables</li>
                                        <li>Fruits</li>
                                        <li>Grains</li>
                                    </ul>
                                </div>
                                <button className="visit-website">Visit Website ☑</button>
                            </div>
                        </div>
                    </section>
                    <hr className="section-divider" />

                    {/* Section 3: Food Donation Tips */}
                    <section className="donation-section">
                        <h3>Food Donation Tips</h3>
                        <div className="tips-grid">
                            <div className="tip-item">
                                <div className="tip-icon">📅</div>
                                <h4>Check Expiration Dates</h4>
                                <p>Donate food before it expires, not after. Most donation centers won't accept expired food.</p>
                            </div>
                            <div className="tip-item">
                                <div className="tip-icon">🚚</div>
                                <h4>Transport Safely</h4>
                                <p>Keep food at safe temperatures during transport, especially for perishables.</p>
                            </div>
                            <div className="tip-item">
                                <div className="tip-icon">📞</div>
                                <h4>Call Before Donating</h4>
                                <p>Contact the donation center first to confirm they can accept your specific food items.</p>
                            </div>
                            <div className="tip-item">
                                <div className="tip-icon">🏦</div>
                                <h4>Consider Food Banks for Bulk Items</h4>
                                <p>Food banks are often better equipped to handle large donations than shelters.</p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Footer */}
            <footer className="donation-footer">
                <p>Making a difference, one meal at a time</p>
                <p>© 2025 WasteNot - Track and reduce your food waste</p>
            </footer>
        </div>
    );
}

export default Donation;