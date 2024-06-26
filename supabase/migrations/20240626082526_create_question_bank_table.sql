-- 创建 question_bank 表
CREATE TABLE IF NOT EXISTS public.question_bank (
  created_at timestamp WITH time zone NOT NULL DEFAULT NOW(),
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  question_id INTEGER NOT NULL,
  question character varying NOT NULL,
  options jsonb NOT NULL,
  correct_answer character varying NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES auth.users(id)
      ON DELETE CASCADE,
  CONSTRAINT unique_question_id UNIQUE (question_id)
);

-- 启用行级安全性（RLS）
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;

-- 创建策略以允许 SELECT
CREATE POLICY select_all_policy ON public.question_bank FOR
SELECT USING (TRUE);

-- 创建策略以允许所有人 INSERT
CREATE POLICY insert_auth_policy ON public.question_bank FOR
INSERT WITH CHECK (TRUE);

-- 创建策略以允许用户更新自己的数据
CREATE POLICY update_auth_policy ON public.question_bank FOR
UPDATE USING (auth.uid() = user_id);
