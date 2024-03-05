--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10 (Homebrew)
-- Dumped by pg_dump version 14.11 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blogs; Type: TABLE; Schema: public; Owner: blooduser
--

CREATE TABLE public.blogs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    image character varying(255)
);


ALTER TABLE public.blogs OWNER TO blooduser;

--
-- Name: blogs_id_seq; Type: SEQUENCE; Schema: public; Owner: blooduser
--

CREATE SEQUENCE public.blogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blogs_id_seq OWNER TO blooduser;

--
-- Name: blogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: blooduser
--

ALTER SEQUENCE public.blogs_id_seq OWNED BY public.blogs.id;


--
-- Name: blogs id; Type: DEFAULT; Schema: public; Owner: blooduser
--

ALTER TABLE ONLY public.blogs ALTER COLUMN id SET DEFAULT nextval('public.blogs_id_seq'::regclass);


--
-- Data for Name: blogs; Type: TABLE DATA; Schema: public; Owner: blooduser
--

COPY public.blogs (id, title, content, created_at, updated_at, image) FROM stdin;
5	Blood donation requirements	These are the requirements to donate blood...	2024-03-01 22:11:48.225684+01	2024-03-01 23:14:25.127+01	/blog_images/requirements.jpeg
4	Blood type and blood compatibility	In this article, we discuss about...	2024-03-01 15:43:25.307313+01	2024-03-01 23:15:28.084+01	/blog_images/blood_type.png
3	what happen after blood donation?	After donating blood, you ...	2024-03-01 15:41:48.942654+01	2024-03-01 23:16:09.215+01	/blog_images/post-donation.jpeg
1	What is blood donation?	Blood donation is all about ...	2024-03-01 15:39:30.909968+01	2024-03-01 23:21:09.878+01	/blog_images/blood_donation.jpeg
\.


--
-- Name: blogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: blooduser
--

SELECT pg_catalog.setval('public.blogs_id_seq', 5, true);


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: blooduser
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

