import { bootstrapCameraKit, createMediaStreamSource, Transform2D } from '@snap/camera-kit';

(async function() {
  const apiToken =
    'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzIwNDQ3MTQ0LCJzdWIiOiJlYWU4NzM2Yi1iYTJhLTQ5ZDEtODgxYS0xNDJlMGMxOGVkOTJ-U1RBR0lOR345OGExMzVjNi02NThjLTQyNmMtYjQ4ZC01ZGE2NmZjODcyZDEifQ.g6oOJrUO7JMTsdOlIwE_YNiVmSL1Q9BTVVgt6SWJF2Y';
  const cameraKit = await bootstrapCameraKit({ apiToken });

  const canvas = document.getElementById('canvas');
  canvas.width = window.width;
  canvas.height = window.height; 
  const session = await cameraKit.createSession({ liveRenderTarget: canvas });
  session.events.addEventListener('error', (event) => {
    if (event.detail.error.name === 'LensExecutionError') {
      console.log(
        'The current Lens encountered an error and was removed.',
        event.detail.error
      );
    }
  });

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const source = createMediaStreamSource(stream, {
    transform: Transform2D.MirrorX,
    cameraType: 'front',
  });
  await session.setSource(source);

  const lens = await cameraKit.lensRepository.loadLens(
    'e2052e49-f08e-4b3f-97d3-966f80cebc12',
    '0c347cbf-bad0-4137-a097-f16fededffdf'
  );
  await session.applyLens(lens);

  await session.play();
  console.log('Lens rendering has started!');
})();