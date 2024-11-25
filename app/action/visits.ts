export const recordVisit = async () => {
  try {
    const response = await fetch('/api/visits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ createdAt: new Date() }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to record visit:', errorText);
      throw new Error(`Failed to record visit: ${errorText}`);
    }
  } catch (error) {
    console.error('Error recording visit:', error);
  }
};
