import S from './Layouts';
import useComment from 'hooks/comment/useComment';
import { CommentType } from 'types';
import { useRef, useState, memo } from 'react';
import { likeOrUnlike } from 'utils/likeOrUnlike';
import { debounce } from 'lodash';
import { toDateStringByFormating } from 'utils/date';

import useModal from 'hooks/common/useModal';
import AlertModal from 'components/common/Portal/AlertModal';
import UserMenuModal from 'components/common/Portal/UserMenuModal';
import PortalContainer from 'components/common/Portal/PortalContainer';
import KebabMenu from 'components/common/KebabMenu';

import { useRecoilValue } from 'recoil';
import { commentState } from 'store/comment';
import { convertNickname } from 'utils/comment';
import { urlParsingRegex } from 'utils/regex';

interface Props {
  comment: CommentType;
  postId: string;
  loginUserId: string;
  isSecret: boolean;
  callback: () => void;
  postCreatorId: string;
  receiverList: string[] | [];
}

const ReplyComment = ({
  comment,
  postId,
  loginUserId,
  isSecret,
  callback,
  postCreatorId,
  receiverList,
}: Props) => {
  const replyInputRef = useRef<any>(null);
  const [deleteId, setDeleteId] = useState<string>('');
  const { modalOpened, onOpenModal, onCloseModal } = useModal();
  const commentList = useRecoilValue(commentState);

  const {
    id,
    creator,
    creator: { uid, nickname, avatar_id },
    content,
    is_edited,
    liker_list,
    created_at,
    is_deleted,
  } = comment;

  const convertedNickname = convertNickname(
    uid,
    is_deleted,
    isSecret,
    postCreatorId === creator.uid,
    nickname
  );
  const avatarId = avatar_id === 0 ? 0 : is_deleted || isSecret ? -1 : avatar_id;

  const {
    onCancel,
    onDeleteReplyComment,
    onUpdateComment,
    onReplyComment,
    editingComment,
    replyingComment,
    onEdit,
    onReplyOpen,
    onReplyCancle,
    onLikeComment,
  } = useComment(callback);

  const {
    modalOpened: userMenuOpened,
    onOpenModal: onOpenUserMenu,
    onCloseModal: onCloseUserMenu,
  } = useModal();

  return (
    <>
      <S.ReplyWrapper>
        <S.ReplyArrow />
        <S.ReplyContainer>
          <S.ROW1>
            <S.CreatorWrapper onClick={onOpenUserMenu}>
              <S.COL1>
                <S.Avatar avatarId={avatarId} />
              </S.COL1>
              <S.COL2>
                <S.Nickname is_deleted={is_deleted} avatar_id={avatar_id}>
                  {convertedNickname}
                </S.Nickname>
              </S.COL2>
            </S.CreatorWrapper>
            <S.CreatedAt>{toDateStringByFormating(created_at)}</S.CreatedAt>

            {!is_deleted && (
              <S.COL3>
                <S.LikeCount
                  size='12px'
                  count={liker_list.length || 0}
                  flag={likeOrUnlike(liker_list, loginUserId)}
                  onClick={debounce(() => onLikeComment(liker_list, loginUserId, id, postId), 500)}
                />
                {/* <S.IsEdited>{is_edited ? '수정됨' : ''}</S.IsEdited> */}
              </S.COL3>
            )}
            {uid === loginUserId && !is_deleted && (
              <S.COL5>
                {uid === loginUserId && !is_deleted && (
                  <KebabMenu>
                    <S.EditBtn onClick={() => onEdit(id)}>수정하기</S.EditBtn>
                    <S.DelBtn
                      onClick={() => {
                        setDeleteId(id);
                        onOpenModal();
                      }}
                    >
                      삭제하기
                    </S.DelBtn>
                  </KebabMenu>
                )}
              </S.COL5>
            )}
          </S.ROW1>

          {/* 수정 Input */}
          <S.ROW2>
            {uid === loginUserId && editingComment === id ? (
              <S.EditContent>
                <S.CustomTextarea autoFocus defaultValue={content} ref={replyInputRef} />
                <S.EditCancelBtn onClick={onCancel}>취소하기</S.EditCancelBtn>
                <S.EditSubmitBtn
                  onClick={() => onUpdateComment(postId, replyInputRef.current.value, id)}
                >
                  등록하기
                </S.EditSubmitBtn>
              </S.EditContent>
            ) : (
              <>
                <S.Content
                  is_deleted={is_deleted}
                  dangerouslySetInnerHTML={{
                    __html: is_deleted ? '삭제된 댓글입니다.' : urlParsingRegex(content),
                  }}
                />
                {!is_deleted && <S.ReplyBtn onClick={() => onReplyOpen(id)}>답글</S.ReplyBtn>}
              </>
            )}
          </S.ROW2>

          {/* 답글 Input */}
          {replyingComment === id && (
            <S.ROW3>
              <S.CustomTextarea
                autoFocus
                ref={replyInputRef}
                placeholder={`${convertedNickname}에게 답글 달기`}
              />
              <S.ReplyCancleBtn onClick={onReplyCancle}>취소하기</S.ReplyCancleBtn>
              <S.ReplySubmitBtn
                onClick={() =>
                  onReplyComment(
                    postId,
                    replyInputRef.current.value,
                    loginUserId,
                    comment.parent_comment_id as string,
                    comment.parent_comment_uid as string,
                    receiverList
                  )
                }
              >
                등록하기
              </S.ReplySubmitBtn>
            </S.ROW3>
          )}
        </S.ReplyContainer>
      </S.ReplyWrapper>

      {modalOpened && (
        <PortalContainer onClose={onCloseModal}>
          <AlertModal
            title='대댓글을 삭제하시겠습니까?'
            twoButton={true}
            callback={() => onDeleteReplyComment(postId, deleteId, commentList)}
            onCloseModal={onCloseModal}
          />
        </PortalContainer>
      )}

      {userMenuOpened && creator.uid !== loginUserId && (
        <PortalContainer onClose={onCloseUserMenu}>
          <UserMenuModal reciever={creator} onCloseModal={onCloseUserMenu} isSecret={isSecret} />
        </PortalContainer>
      )}
    </>
  );
};

export default memo(ReplyComment);
