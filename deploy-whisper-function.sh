#!/bin/bash

# Deploy Whisper Edge Function naar Supabase
# Run dit script in je terminal: bash deploy-whisper-function.sh

set -e

echo "🚀 Deploying Whisper Edge Function to Supabase..."
echo ""

cd "$(dirname "$0")"

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing via Homebrew..."
    brew install supabase/tap/supabase
fi

# Step 1: Login (opent browser)
echo "📝 Step 1: Login to Supabase (this will open your browser)..."
supabase login

# Step 2: Link project
echo ""
echo "🔗 Step 2: Linking project..."
supabase link --project-ref xezygggzjlxclzndbxfl

# Step 3: Set OpenAI API Key secret
echo ""
echo "🔐 Step 3: Setting OpenAI API Key secret..."
echo "⚠️  Vervang YOUR_API_KEY met je echte OpenAI API key!"
read -p "Enter OpenAI API Key: " API_KEY
supabase secrets set OPENAI_API_KEY=$API_KEY

# Step 4: Deploy function
echo ""
echo "📦 Step 4: Deploying Edge Function..."
supabase functions deploy transcribe-audio

echo ""
echo "✅ Done! Edge Function deployed successfully!"
echo "🎤 You can now test voice input in the BuildFlow app!"

