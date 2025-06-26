#!/usr/bin/env python3
"""
Firecrawl API Setup for H+O Advanced Lead Generation System
"""

import os

def setup_firecrawl_api():
    """Setup Firecrawl API key"""
    print("🔥 FIRECRAWL API SETUP")
    print("=" * 40)
    print("Firecrawl provides advanced web scraping and research capabilities")
    print("for building comprehensive dossiers on decision makers and companies.")
    print()
    print("To get a Firecrawl API key:")
    print("1. Go to https://firecrawl.dev")
    print("2. Sign up for an account")
    print("3. Get your API key from the dashboard")
    print()
    
    api_key = input("Enter your Firecrawl API key (or press Enter to skip): ").strip()
    
    if api_key:
        # Save API key
        with open('firecrawl_api_key.txt', 'w') as f:
            f.write(api_key)
        print("✅ Firecrawl API key saved!")
        return True
    else:
        print("⚠️ Skipping Firecrawl setup - AI research will be limited")
        return False

if __name__ == "__main__":
    setup_firecrawl_api() 