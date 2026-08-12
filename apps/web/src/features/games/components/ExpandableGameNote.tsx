'use client';

import { useEffect, useRef, useState } from 'react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

type ExpandableGameNoteProps = {
  note?: string | null;
};

export function ExpandableGameNote({
  note,
}: Readonly<ExpandableGameNoteProps>) {
  const noteRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const element = noteRef.current;

    if (!element) {
      return;
    }

    const measureOverflow = () => {
      if (expanded) {
        setCanExpand(true);
        return;
      }

      const fullNote = element.cloneNode(true) as HTMLElement;
      fullNote.classList.remove('line-clamp-3');
      Object.assign(fullNote.style, {
        height: 'auto',
        maxHeight: 'none',
        overflow: 'visible',
        position: 'absolute',
        visibility: 'hidden',
        width: `${element.clientWidth}px`,
      });
      document.body.appendChild(fullNote);
      setCanExpand(fullNote.scrollHeight > element.clientHeight + 1);
      fullNote.remove();
    };

    measureOverflow();

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [expanded, note]);

  if (!note) {
    return null;
  }

  return (
    <Box
      display="flex"
      direction="column"
      gap="xs"
      className="col-span-2 w-full min-w-0"
    >
      <Typography
        ref={noteRef}
        as="p"
        variant="caption"
        tone="muted"
        className={
          expanded ? 'whitespace-pre-line' : 'line-clamp-3 whitespace-pre-line'
        }
      >
        {note}
      </Typography>
      {canExpand ? (
        <button
          type="button"
          aria-expanded={expanded}
          className="text-primary self-end text-xs font-semibold hover:underline"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? '閉じる' : 'もっと見る'}
        </button>
      ) : null}
    </Box>
  );
}
