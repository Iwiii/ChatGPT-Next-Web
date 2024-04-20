'use client'
import Image from 'next/image';
import React from "react";
import {
    HashRouter as Router,
    Routes,
    Route,
    useLocation,
  } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import styles from "./knowledge-base.module.scss";

import ResetIcon from "../icons/reload.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import CopyIcon from "../icons/copy.svg";
import ClearIcon from "../icons/clear.svg";
import LoadingIcon from "../icons/three-dots.svg";
import EditIcon from "../icons/edit.svg";
import EyeIcon from "../icons/eye.svg";
import DownloadIcon from "../icons/download.svg";
import UploadIcon from "../icons/upload.svg";
import ConfigIcon from "../icons/config.svg";
import ConfirmIcon from "../icons/confirm.svg";

import ConnectionIcon from "../icons/connection.svg";
import CloudSuccessIcon from "../icons/cloud-success.svg";
import CloudFailIcon from "../icons/cloud-fail.svg";

import {
  Input,
  List,
  ListItem,
  Modal,
  PasswordInput,
  Popover,
  Select,
  showConfirm,
  showToast,
  TabHeader,
} from "./ui-lib";
import { ModelConfigList } from "./model-config";

import { IconButton } from "./button";
import {
  SubmitKey,
  useChatStore,
  Theme,
  useUpdateStore,
  useAccessStore,
  useAppConfig,
} from "../store";

import Locale, {
  AllLangs,
  ALL_LANG_OPTIONS,
  changeLang,
  getLang,
} from "../locales";
import { copyToClipboard } from "../utils";
import Link from "next/link";
import {
  Anthropic,
  Azure,
  Google,
  OPENAI_BASE_URL,
  Path,
  RELEASE_URL,
  STORAGE_KEY,
  ServiceProvider,
  SlotID,
  UPDATE_URL,
} from "../constant";
import { Prompt, SearchService, usePromptStore } from "../store/prompt";
import { ErrorBoundary } from "./error";
import { InputRange } from "./input-range";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarPicker } from "./emoji";
import { getClientConfig } from "../config/client";
import { useSyncStore } from "../store/sync";
import { nanoid } from "nanoid";
import { useMaskStore } from "../store/mask";
import { ProviderType } from "../utils/cloud";
import { container } from "webpack";

interface TagLabelProps {
    label: string;
    icon: string;
}

function TagLabel(props: TagLabelProps) {
    return (
        <div>
        <Image src={props.icon} alt={props.label} width={20} height={20} />
        <span>{props.label}</span>
        </div>
    )
}

interface CardProps {
    title: string;
    icon: string;
    description?: string;
    tags?: TagLabelProps[];
    onClick?: () => void;
    hoverBtn?: React.ReactNode; 
}

function Card(props: CardProps) {
  
    return (
        <div className={styles["card"]} onClick={props.onClick}>
            <div className={styles["card-header"]}>
                <Image src={props.icon} alt={""} width={20} height={20} />
                <div className={styles["card-title"]}>{props.title}</div>
            </div>
            {props.description ? <div className={styles["card-description"]}>{props.description} </div>: null}
            <div className={styles["card-tags"]}>
            {props.tags?.map((tag, index) => (
                    <TagLabel key={index} {...tag} />
                ))}
            </div>
            <div className={styles["card-footer"]}>
                {props.hoverBtn}
            </div>
        </div>
    )
}
interface uploadFilesBlockProps {
    onClickNext: () => void;
}
function UpLoadFilesBlock(){
    return (
        <div >
            <div className={styles["upload"]}>
                <div>
                <Image src={UploadIcon} alt={""} width={20} height={20} />
                <span>{Locale.KnowledgeBase.upload}</span>
                </div>
                
                <div>
                {Locale.KnowledgeBase.uploadDesc(['TXT','MARKDOWN','PDF'])}
            </div>
            </div>
            <div className={styles["nextButton"]}>{Locale.KnowledgeBase.next}</div>
        </div>
    )
}

enum PageId {
    Home,
    CreateKnowledge
}
interface pageProps {
    pageId?: number;
    navigate: (pageId: PageId) => void;
}
function HomePage(props: pageProps) {
    return (
        <div className={styles["container"]}>
            <Card title={Locale.KnowledgeBase.create} icon="" description={Locale.KnowledgeBase.createDesc} onClick={()=>{
                props.navigate(PageId.CreateKnowledge);
            }}/>
          </div>
    )
}
function CreateKnowledgePage(props: pageProps) {
    return (
    <div className={styles["container"]}>
        <UpLoadFilesBlock />
    </div>
    )
}
export function KnowledgeBase() {
    const [curPageId,setPageId] = useState<number>(0)
    const pageNames = [Locale.KnowledgeBase.name,Locale.KnowledgeBase.create]
    const pageName = curPageId==0?pageNames[curPageId] : Locale.KnowledgeBase.name + '/' + pageNames[curPageId]
    const homePage = <HomePage pageId={PageId.Home} navigate={(pageId)=>{setPageId(pageId)}}/>
    const createKnowLedgePage = <CreateKnowledgePage pageId={PageId.CreateKnowledge} navigate={(pageId)=>{setPageId(pageId)}}/>
    const pages = [homePage,createKnowLedgePage]
    const curPage = pages[curPageId]
  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region onClick={()=>{
        if (curPageId !== 0) setPageId(0)
      }}>
        {/* header */}
        <div className="window-header-title">
          <div className="window-header-main-title">
            {pageName}
          </div>
          {curPageId !==0 && <div className="window-header-sub-title">
            {Locale.KnowledgeBase.subTitle}
          </div>}
        </div>
      </div>
      {curPage}
    </ErrorBoundary>
  );
}
