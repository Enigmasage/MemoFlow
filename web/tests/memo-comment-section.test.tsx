import { create } from "@bufbuild/protobuf";
import { render, screen } from "@testing-library/react";
import { act, createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MemoCommentSection, { type MemoCommentSectionHandle } from "@/components/MemoCommentSection";
import { State } from "@/types/proto/api/common_pb";
import { MemoSchema, Visibility } from "@/types/proto/api/memo_service_pb";

const mocks = vi.hoisted(() => ({
  currentUser: { name: "users/alice" } as { name: string } | undefined,
}));

vi.mock("@/components/MemoEditor", () => ({
  preloadMemoEditing: () => Promise.resolve(),
  MemoEditor: ({ autoFocus, draft }: { autoFocus?: boolean; draft: { parent?: string; space?: string; visibility?: Visibility } }) => (
    <div
      data-testid="comment-editor"
      data-auto-focus={autoFocus}
      data-parent-memo-name={draft.parent}
      data-space={draft.space}
      data-visibility={draft.visibility}
    >
      <textarea aria-label="Comment editor" />
    </div>
  ),
}));
vi.mock("@/components/MemoView", () => ({ default: () => <div data-testid="comment-memo" /> }));
vi.mock("@/hooks/useCurrentUser", () => ({ default: () => mocks.currentUser }));
vi.mock("@/utils/i18n", () => ({ useTranslate: () => (key: string) => key }));

describe("MemoCommentSection", () => {
  beforeEach(() => {
    mocks.currentUser = { name: "users/alice" };
  });

  it("does not offer or imperatively open a comment editor for archived memos", async () => {
    const memo = create(MemoSchema, {
      name: "memos/archived",
      creator: "users/alice",
      state: State.ARCHIVED,
    });

    const ref = createRef<MemoCommentSectionHandle>();
    render(<MemoCommentSection ref={ref} memo={memo} comments={[]} />);

    await act(async () => {
      await ref.current?.openEditor();
    });

    expect(screen.getByRole("heading", { name: "memo.comment.self" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "memo.comment.self" })).toHaveAttribute("id", "memo-comments");
    expect(screen.queryByRole("button", { name: /memo.comment.write-a-comment/ })).not.toBeInTheDocument();
    expect(screen.queryByTestId("comment-editor")).not.toBeInTheDocument();
  });

  it("opens and focuses the existing comment editor through its sidebar handle", async () => {
    const memo = create(MemoSchema, {
      name: "memos/detail",
      creator: "users/alice",
      state: State.NORMAL,
    });
    const ref = createRef<MemoCommentSectionHandle>();

    render(
      <>
        <button type="button">Outside editor</button>
        <MemoCommentSection ref={ref} memo={memo} comments={[]} />
      </>,
    );
    await act(async () => {
      await ref.current?.openEditor();
    });

    expect(screen.getByTestId("comment-editor")).toHaveAttribute("data-auto-focus", "true");
    expect(screen.getByTestId("comment-editor")).toHaveAttribute("data-parent-memo-name", "memos/detail");

    screen.getByRole("button", { name: "Outside editor" }).focus();
    await act(async () => {
      await ref.current?.openEditor();
    });
    expect(screen.getByRole("textbox", { name: "Comment editor" })).toHaveFocus();
  });

  it("seeds comments on a shared memo with its durable Space audience", async () => {
    const memo = create(MemoSchema, {
      name: "memos/shared",
      creator: "users/alice",
      state: State.NORMAL,
      space: "spaces/team",
      visibility: Visibility.SPACE,
    });

    render(<MemoCommentSection memo={memo} comments={[]} />);
    await act(async () => {
      screen.getByRole("button", { name: /memo.comment.write-a-comment/ }).click();
    });

    expect(screen.getByTestId("comment-editor")).toHaveAttribute("data-space", "spaces/team");
    expect(screen.getByTestId("comment-editor")).toHaveAttribute("data-visibility", String(Visibility.SPACE));
  });

  it("uses the supplied total instead of the currently loaded page length", () => {
    const memo = create(MemoSchema, {
      name: "memos/detail",
      creator: "users/alice",
      state: State.NORMAL,
    });
    const comment = create(MemoSchema, { name: "memos/comment" });

    render(<MemoCommentSection memo={memo} comments={[comment]} commentCount={24} />);

    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getAllByTestId("comment-memo")).toHaveLength(1);
  });
});
