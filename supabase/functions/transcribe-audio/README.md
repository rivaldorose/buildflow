# Transcribe Audio Edge Function

This Supabase Edge Function transcribes audio using OpenAI's Whisper API.

## Setup

1. Get your OpenAI API key from https://platform.openai.com/api-keys

2. Set the environment variable in Supabase:
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-xxxxxxxxxxxxx
   ```

3. Deploy the function:
   ```bash
   supabase functions deploy transcribe-audio
   ```

## Usage

```javascript
const { data, error } = await supabase.functions.invoke('transcribe-audio', {
  body: {
    audio: base64AudioString,
    audioType: 'audio/webm',
    language: 'nl', // or 'en'
  },
})
```

## Cost

Whisper API costs $0.006 per minute of audio.

