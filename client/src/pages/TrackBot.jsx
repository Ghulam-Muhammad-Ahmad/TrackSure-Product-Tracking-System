import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
  forwardRef,
} from "react";
import {
  Plus,
  Settings,
  Send,
  Paperclip,
  BotIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { AuthContext } from "@/providers/authProvider";
import axios from "axios";
import { API } from "@/config/api";

// Markdown imports
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import ReactECharts from "echarts-for-react";

// helper functions
function cx(...args) {
  return args.filter(Boolean).join(" ");
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

const MarkdownMessage = React.memo(function MarkdownMessage({ content }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (match?.[1] === "echarts") {
              try {
                const codeString = String(children).trim();
                const option = JSON.parse(codeString);

                const height =
                  typeof option?.height === "number" ? option.height : 400;

                // ✅ Memoize ECharts component too
                const MemoEchart = React.useMemo(
                  () => (
                    <ReactECharts
                      option={option}
                      style={{ height }}
                      notMerge={true}
                      lazyUpdate={true}
                      theme="light"
                    />
                  ),
                  [codeString] // only re-render when chart JSON changes
                );

                return <div className="my-4">{MemoEchart}</div>;
              } catch (err) {
                console.error("ECharts JSON parse error:", err);
                return (
                  <pre
                    {...props}
                    className="bg-red-50 text-red-500 p-2 rounded text-xs overflow-auto"
                  >
                    {String(children)}
                  </pre>
                );
              }
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

// ✅ Simple wrapper that handles scrolling properly
const MessagesContainer = forwardRef(function MessagesContainer(
  { children, className },
  ref
) {
  return (
    <div ref={ref} className={cx("overflow-y-auto p-4 overflow-x-hidden", className)}>
      {children}
    </div>
  );
});

export default function TrackBot() {
  const { profile, token } = useContext(AuthContext);

  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [composer, setComposer] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!activeId && chats.length > 0) setActiveId(chats[0].chat_id);
    else if (chats.length === 0) setActiveId(null);
  }, [chats, activeId]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(API.GET_CHATS, {
          headers: { "x-jwt-bearer": token },
        });
        const fetchedChats = response.data.map((chat) => ({
          ...chat,
          id: chat.chat_id,
          createdAt: new Date(chat.created_at).getTime(),
        }));
        setChats(fetchedChats);
        if (fetchedChats.length > 0 && !activeId) {
          setActiveId(fetchedChats[0].chat_id);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
        toast.error("Failed to load chats.");
      }
    };
    fetchChats();
  }, [profile?.id, profile?.tenant_id, token]);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeId) ?? null,
    [chats, activeId]
  );

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return chats.filter((chat) =>
      chat.title?.toLowerCase().includes(lowerCaseQuery)
    );
  }, [chats, searchQuery]);

  const viewportRef = useRef(null);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [activeChat?.messages?.length]);

  async function createChat(title) {
    try {
      const response = await axios.post(
        API.CREATE_CHAT,
        { title: title || "New chat" },
        { headers: { "x-jwt-bearer": token } }
      );
      const newChat = {
        ...response.data,
        id: response.data.chat_id,
        createdAt: new Date(response.data.created_at).getTime(),
        messages: [],
      };
      setChats((s) => [newChat, ...s]);
      setActiveId(newChat.id);
      toast.success("Chat created");
      setIsCreateChatModalOpen(false);
    } catch (error) {
      console.error("Failed to create chat:", error);
      toast.error("Failed to create chat.");
    }
  }

  async function deleteChat(id) {
    try {
      await axios.delete(`${API.DELETE_CHAT}${id}`, {
        headers: { "x-jwt-bearer": token },
      });
      setChats((s) => s.filter((c) => c.id !== id));
      if (activeId === id) {
        const remaining = chats.filter((c) => c.id !== id);
        setActiveId(remaining[0]?.id ?? null);
      }
      toast.info("Chat deleted");
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("Failed to delete chat.");
    }
  }

  function addMessage(messageContent, role = "user", chatId = activeChat?.id) {
    if (!activeChat) return;
    const newMessage = {
      id: uid("m"),
      role,
      content: messageContent,
      ts: Date.now(),
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    );
  }

  async function send() {
    if (!composer.trim() || !activeChat || !token) return;
    const userText = composer.trim();
    setComposer("");
    setIsSending(true);
    addMessage(userText, "user");

    try {
      const response = await axios.post(
        API.SEND_MESSAGE,
        { message: userText, chatId: activeChat.id },
        { headers: { "x-jwt-bearer": token } }
      );
      const assistantMessageContent = response.data.content;
      addMessage(assistantMessageContent, "assistant");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message.");
      addMessage("Error: Could not send message.", "assistant");
    }
    setIsSending(false);
  }

  return (
    <div className="trackbot-body">
      <div className="p-4 flex gap-4 justify-start overflow-hidden w-full">
        {/* LEFT: Sidebar */}
        <div className="w-[20%]">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-2xl">Chats</CardTitle>
                <Dialog
                  open={isCreateChatModalOpen}
                  onOpenChange={setIsCreateChatModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex items-center gap-2 bg-primary text-secondary px-2"
                    >
                      <Plus size={14} /> New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new chat</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                      <Input
                        placeholder="Chat title (optional)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const t = e.target.value;
                            createChat(t || undefined);
                          }
                        }}
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={() => createChat()}
                          size="sm"
                          className="bg-primary text-secondary"
                          variant="primary"
                        >
                          Create
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="px-2 py-2">
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <ScrollArea className="flex-1">
                <div className="divide-y">
                  {filteredChats.length === 0 && (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No chats yet. Start a conversation.
                    </div>
                  )}
                  {filteredChats.map((c) => (
                    <div
                      key={c.id}
                      className={cx(
                        "flex items-center gap-2 p-3 w-full cursor-pointer hover:bg-muted dark:hover:bg-muted",
                        activeId === c.id ? "bg-primary/10 dark:bg-primary/20" : ""
                      )}
                      onClick={() => setActiveId(c.id)}
                    >
                      <Avatar>
                        <AvatarFallback>
                          {c.title?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 w-40 flex flex-col">
                        <div className="text-sm font-medium text-wrap truncate">
                          {c.title || "Untitled"}
                        </div>
                        <div className="text-xs w-1/2 text-slate-500 dark:text-slate-400 truncate">
                          {c.messages[c.messages.length - 1]?.content ??
                            "No messages"}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            key="copy-id" // Added unique key
                            onClick={() => {
                              navigator.clipboard?.writeText(c.id);
                              toast.info("ID copied");
                            }}
                          >
                            Copy ID
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            key="delete-chat" // Added unique key
                            onClick={() => deleteChat(c.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* CENTER: Chat window */}
        <div className="w-[80%] overflow-hidden">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">
                  {activeChat?.title ?? "No chat selected"}
                </h2>
                <span className="text-sm">
                  {activeChat
                    ? new Date(activeChat.createdAt).toLocaleString()
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (activeChat) {
                      setChats((prev) =>
                        prev.map((c) =>
                          c.id === activeChat.id ? { ...c, messages: [] } : c
                        )
                      );
                      toast.info("Chat cleared");
                    }
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardContent className="p-0 flex-1 flex flex-col">
                <MessagesContainer
                  ref={viewportRef}
                  className="h-[65vh] bg-white dark:bg-card w-full"
                >
                  <div className="flex flex-col gap-4 w-full">
                    {activeChat?.messages.map((m) => (
                      <div
                        key={m.id}
                        className={cx(
                          "flex gap-3 items-start w-full",
                          m.role === "assistant"
                            ? "justify-start"
                            : "justify-end"
                        )}
                      >
                        {m.role === "assistant" && (
                          <Avatar>
                            <AvatarFallback>
                              <BotIcon size={20} className="text-primary" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="p-3 rounded-2xl bg-secondary max-w-[100%] w-fit break-words overflow-auto markdowncontainer">
                          <MarkdownMessage content={m.content} />
                        </div>
                        {m.role === "user" && (
                          <Avatar>
                            <AvatarFallback>
                              {profile?.first_name?.[0]?.toUpperCase()}
                              {profile?.last_name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}

                    {!activeChat?.messages?.length && (
                      <div className="p-6 text-center text-sm text-slate-500">
                        No messages — say hi 👋
                      </div>
                    )}
                  </div>
                </MessagesContainer>

                {/* Composer */}
                <div className="border-t p-3 bg-transparent">
                  <div className="flex gap-2 items-end">
                    <Textarea
                      rows={1}
                      placeholder="Type a message..."
                      className="min-h-0 max-w-full"
                      value={composer}
                      onChange={(e) => setComposer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send();
                        }
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="Attach">
                        <Paperclip />
                      </Button>
                      <Button
                        onClick={() => send()}
                        disabled={isSending}
                        variant="primary"
                        className="bg-primary text-secondary"
                      >
                        {isSending ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send size={14} className="mr-2" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
