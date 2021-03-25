import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CommentsOverlay from '../../components/commentsOverlay';
import {
  IComment,
  IComments,
  ICommentsSelected,
} from '../../types/youtubeTypes';

export default function Comments() {
  const router = useRouter();
  const videoID = router.query?.videoID ? String(router.query?.videoID) : '';
  const [commentSelected, setCommentSelected] = useState<ICommentsSelected>();
  const [commentsResponse, setCommentsResponse] = useState<IComments>();

  async function submitSelectedComment(
    comment: IComment,
    livestreamChannelId: string
  ) {
    setCommentSelected({
      livestreamChannelId,
      comment,
    });

    const response = fetch('/api/selectedComments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentSelected),
    });

    return response;
  }

  async function getComments(videoID: string) {
    const response = await fetch('/api/livestream?id=' + videoID);
    if (response.status === 200) {
      setCommentsResponse(await response.json());
    }
  }

  useEffect(() => {
    if (videoID) {
      getComments(videoID);
      setInterval(getComments, 1000 * 60, videoID);
    }
  }, [videoID]);
  return (
    <div className="container">
      <div className="py-5 text-center">
        <h1>Comentarios</h1>
        <p className="lead">Clique para enviar o comentario para live</p>

        <CommentsOverlay commentSelected={commentSelected} />
      </div>

      <div className="row">
        <div className="col-12">
          {commentsResponse &&
            commentsResponse.comments.map((comment, index) => {
              return (
                <div key={index} className="card p-2 my-2">
                  <div className="media d-flex align-items-center">
                    <img
                      src={comment.profileImageUrl}
                      className="mr-3 rounded-circle"
                      alt="..."
                      width="60rem"
                    />
                    <div className="media-body">
                      <h5 className="mt-0">{comment.displayName}</h5>
                      <span className="font-italic">
                        {comment.displayMessage}
                      </span>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                      <button
                        onClick={() => {
                          submitSelectedComment(
                            commentsResponse.comments[index],
                            commentsResponse.commentsInfo.livestreamChannelId
                          );
                        }}
                        className="btn btn-outline-dark my-2"
                      >
                        Enviar comentário
                      </button>
                      <span className="badge badge-secondary">
                        {String(
                          new Date(comment.publishedAt).getHours()
                        ).padStart(2, '0')}
                        :
                        {String(
                          new Date(comment.publishedAt).getMinutes()
                        ).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
