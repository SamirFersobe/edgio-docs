import styled from 'styled-components';
import SectionHeader from './SectionHeader';
import Video from 'components/MDX/Video';

const StyledComp = styled.div`
  display: grid;
  row-gap: 42px;

  .videos {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 54px;
  }

  .video {
    display: inherit;
    row-gap: 14px;

    .title {
      font-weight: 500;
      font-size: 24px;
      line-height: 29px;
      color: #1a1a1a;
    }
  }

  // .video-embed__box {
  //   height: 259px;
  //   background-color: black;
  // }
`;

export default function DeveloperTools() {
  const videos = [
    {
      title: 'What & Why',
      url: 'https://www.youtube.com/embed/sJ6AkTrcZvg?rel=0',
    },
    {
      title: 'Deploying a GitHub Project',
      url: 'https://www.youtube.com/embed/F8uN03ps1As?rel=0',
    },
    {
      title: 'How to Prefetch',
      url: 'https://www.youtube.com/embed/lfhSDCNgzfs?rel=0',
    },
    {
      title: 'What are the Layer0 DevTools',
      url: 'https://www.youtube.com/embed/4AYQAvkc0UY?rel=0',
    },
  ];

  return (
    <StyledComp>
      <SectionHeader title="Layer0 Videos and Tutorials" />

      <div className="videos">
        {videos.map((video, index) => (
          <div className="video" key={index}>
            <h1 className="title">{video.title}</h1>
            <div className="video-embed__box">
              <Video>{video.url}</Video>
            </div>
          </div>
        ))}
      </div>
    </StyledComp>
  );
}