import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  ScrollView,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/theme';
import { brand } from '@/src/theme/colors';
import { StatusBadge } from '@/src/components/StatusBadge';
import { TypeBadge } from '@/src/components/TypeBadge';
import { formatAmount, formatDateTime, shortenHash, capitalise } from '@/src/utils/format';
import type { Transaction } from './types';

function optionalNonEmptyString(v: unknown): string | null {
  if (v == null || v === '') return null;
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

interface DetailRowProps {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
  onCopy?: () => void;
}

function DetailRow({ label, value, mono = false, onCopy }: DetailRowProps) {
  const { colors } = useTheme();
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{label}</Text>
      <Pressable
        onPress={onCopy}
        style={styles.detailValueWrap}
        disabled={!onCopy}
      >
        <Text
          style={[
            styles.detailValue,
            { color: colors.text, fontFamily: mono ? 'Lato_400Regular' : 'Lato_400Regular' },
          ]}
          selectable
        >
          {value}
        </Text>
        {onCopy && (
          <Feather name="copy" size={12} color={colors.textMuted} style={{ marginLeft: 4 }} />
        )}
      </Pressable>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.sectionTitle, { color: colors.textSubtle }]}>{title}</Text>
  );
}

interface Props {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  transaction: Transaction | null;
  /** Clear selection after swipe-dismiss or tapping backdrop — keeps state in sync with the sheet. */
  onDismiss?: () => void;
}

/**
 * `BottomSheetModal` stays mounted when `transaction` is null so the ref always points at a modal.
 */
function DetailsSheetBody({
  t,
  bottomSheetRef,
}: {
  t: Transaction;
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
}) {
  const { colors } = useTheme();

  const openReceipt = useCallback(() => {
    const url = t.raw.receipt_url;
    if (url) Linking.openURL(url as string);
  }, [t]);

  const txHash =
    optionalNonEmptyString(t.raw.deposit_tx_hash) ??
    optionalNonEmptyString(t.raw.destination_tx_hash);
  const fromAddress =
    optionalNonEmptyString(t.raw.from_address) ??
    optionalNonEmptyString(t.source.details.address);
  const network = (t.source.details.network as string | null) ?? null;
  const bankName = (t.destination.details.bankName as string | null) ?? null;
  const iban = (t.destination.details.iban as string | null) ?? null;
  const bic = (t.destination.details.bic as string | null) ?? null;
  const exchangeRate = t.raw.receipt_exchange_rate as string | null;
  const receiptUrl = t.raw.receipt_url as string | null;

  return (
    <>
      {/* Header */}
      <View style={styles.sheetHeader}>
        <View style={styles.badges}>
          <TypeBadge type={t.type} />
          <StatusBadge status={t.status} />
        </View>
        <Pressable
          onPress={() => bottomSheetRef.current?.dismiss()}
          hitSlop={8}
          style={[styles.closeBtn, { backgroundColor: colors.surface }]}
        >
          <Feather name="x" size={16} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Amount */}
        <View style={[styles.amountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.amountLabel, { color: colors.textSubtle }]}>Amount sent</Text>
          <Text style={[styles.amountValue, { color: colors.text }]}>
            {formatAmount(t.source.amount.value, t.source.amount.currency)}
          </Text>
          {t.source.amount.currency !== t.destination.amount.currency && (
            <>
              <Feather name="arrow-down" size={14} color={colors.textMuted} style={{ marginTop: 2 }} />
              <Text style={[styles.amountConverted, { color: colors.textSubtle }]}>
                {formatAmount(t.destination.amount.value, t.destination.amount.currency)}
              </Text>
              {exchangeRate && (
                <Text style={[styles.rate, { color: colors.textMuted }]}>
                  Rate: {exchangeRate}
                </Text>
              )}
            </>
          )}
        </View>

        {/* Transaction details */}
        <SectionTitle title="TRANSACTION" />
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <DetailRow label="ID" value={t.id} mono />
          <DetailRow label="Date" value={formatDateTime(t.date)} />
          {t.completedAt && <DetailRow label="Completed" value={formatDateTime(t.completedAt)} />}
          <DetailRow label="Rail" value={capitalise(t.rail)} />
          <DetailRow label="Provider" value={t.provider} />
          <DetailRow label="Provider ID" value={shortenHash(t.providerId)} mono />
        </View>

        {/* Parties */}
        <SectionTitle title="FROM" />
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <DetailRow label="Name" value={t.source.name} />
          {fromAddress && (
            <DetailRow label="Address" value={shortenHash(fromAddress)} mono />
          )}
          {network && <DetailRow label="Network" value={capitalise(network)} />}
        </View>

        <SectionTitle title="TO" />
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <DetailRow label="Name" value={t.destination.name} />
          {bankName && <DetailRow label="Bank" value={bankName} />}
          {iban && <DetailRow label="IBAN" value={iban} mono />}
          {bic && <DetailRow label="BIC / SWIFT" value={bic} mono />}
        </View>

        {/* Blockchain */}
        {txHash && (
          <>
            <SectionTitle title="ON-CHAIN" />
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <DetailRow label="Tx Hash" value={shortenHash(txHash, 10)} mono />
            </View>
          </>
        )}

        {/* Receipt link */}
        {receiptUrl && (
          <Pressable
            onPress={openReceipt}
            style={({ pressed }) => [
              styles.receiptBtn,
              { borderColor: brand.secondary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="external-link" size={14} color={brand.secondary} />
            <Text style={[styles.receiptLabel, { color: brand.secondary }]}>
              View receipt
            </Text>
          </Pressable>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );
}

export function TransactionDetails({ bottomSheetRef, transaction: t, onDismiss }: Props) {
  const { colors } = useTheme();

  const snapPoints = useMemo(() => ['55%', '90%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.4} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      backgroundStyle={{ backgroundColor: colors.surfaceElevated }}
      enablePanDownToClose
      onDismiss={onDismiss}
    >
      <BottomSheetView style={[styles.sheet, { backgroundColor: colors.surfaceElevated }]}>
        {t ? <DetailsSheetBody t={t} bottomSheetRef={bottomSheetRef} /> : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  amountCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: 'Lato_400Regular',
  },
  amountValue: {
    fontSize: 26,
    fontFamily: 'Lato_900Black',
  },
  amountConverted: {
    fontSize: 16,
    fontFamily: 'Lato_700Bold',
  },
  rate: {
    fontSize: 11,
    fontFamily: 'Lato_400Regular',
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Lato_700Bold',
    letterSpacing: 0.8,
    marginTop: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: 'Lato_400Regular',
    flex: 1,
  },
  detailValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  detailValue: {
    fontSize: 13,
    textAlign: 'right',
    flexShrink: 1,
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
  },
  receiptLabel: {
    fontSize: 14,
    fontFamily: 'Lato_700Bold',
  },
});
