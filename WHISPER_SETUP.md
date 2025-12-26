# Whisper Voice-to-Text Setup Guide

This guide explains how to set up the Whisper API voice-to-text feature in BuildFlow.

## Prerequisites

1. OpenAI API Key (get from https://platform.openai.com/api-keys)
2. Supabase project with Edge Functions enabled

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

## Step 3: Link Your Project

```bash
cd /Users/rivaldomacandrew/Desktop/apps/build-flow-9138e81d
supabase link --project-ref YOUR_PROJECT_REF
```

Get your project ref from: https://app.supabase.com → Your Project → Settings → General → Reference ID

## Step 4: Set OpenAI API Key Secret

```bash
supabase secrets set OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

Replace `sk-proj-xxxxxxxxxxxxx` with your actual OpenAI API key.

## Step 5: Deploy Edge Function

```bash
supabase functions deploy transcribe-audio
```

## Step 6: Test

1. Open BuildFlow app
2. Go to a project and open Project Notes
3. Click the microphone icon in the TipTap editor toolbar
4. Click the microphone button in the dialog
5. Speak into your microphone
6. Click stop when done
7. The text should appear in the editor

## Cost Estimation

Whisper API costs **$0.006 per minute** of audio.

- 1 minute = $0.006
- 10 minutes = $0.06
- 100 minutes = $0.60

Very affordable! 💰

## Troubleshooting

### "Transcription failed"
- Check if Supabase Edge Function is deployed
- Verify OPENAI_API_KEY is set correctly
- Check Supabase logs: `supabase functions logs transcribe-audio`

### "Microphone permission denied"
- Allow microphone access in browser settings
- Check browser console for errors

### "No microphone found"
- Connect a microphone to your device
- Check system audio settings

## Alternative: Use Browser-Only Transcription

If you don't want to use Whisper API, the component will fall back to browser's built-in speech recognition. However, accuracy is lower and it only works in Chrome/Edge.

## Environment Variables

No environment variables needed in the frontend - everything is handled by Supabase Edge Functions.

